import prisma from "../../utils/prisma";

// ===================== HELPERS =====================

type FilterMode = "date" | "month" | "year";

interface DateFilter {
  mode: FilterMode;
  date?: string;   // "2026-04-09"
  month?: number;  // 1-12
  year?: number;   // 2026
}

/**
 * Returns { gte, lte } date range based on filter mode.
 * Used in all where clauses that filter by date.
 */
function buildDateRange(filter: DateFilter): { gte: Date; lte: Date } | null {
  const { mode, date, month, year } = filter;

  if (mode === "date" && date) {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    const end   = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);
    return { gte: start, lte: end };
  }

  if (mode === "month" && month && year) {
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 0, 23, 59, 59);
    return { gte: start, lte: end };
  }

  if (mode === "year" && year) {
    const start = new Date(year, 0, 1);
    const end   = new Date(year, 11, 31, 23, 59, 59);
    return { gte: start, lte: end };
  }

  return null; // no filter → all time
}

/**
 * Builds a monthKey string like "2026-04" for Payment queries.
 * Returns null when filter mode is "year" or "date" (not month-specific).
 */
function buildMonthKey(filter: DateFilter): string | null {
  if (filter.mode === "month" && filter.month && filter.year) {
    return `${filter.year}-${String(filter.month).padStart(2, "0")}`;
  }
  return null;
}

// ===================== DASHBOARD STATS (filtered) =====================

const getDashboardStatsDB = async (mosqueId: string, filter?: DateFilter) => {
  const now = new Date();

  // fallback: current month when no filter
  const activeFilter: DateFilter = filter ?? {
    mode: "month",
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  };

  const dateRange  = buildDateRange(activeFilter);
  const monthKey   = buildMonthKey(activeFilter);

  // For "unpaid this month" we always need a concrete monthKey
  const currentMonthKey =
    monthKey ??
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  // Date range for last month (growth comparison – only meaningful in month mode)
  const lastMonthFilter: DateFilter = {
    mode: "month",
    month: activeFilter.month ? activeFilter.month - 1 || 12 : now.getMonth(),
    year:
      activeFilter.month === 1
        ? (activeFilter.year ?? now.getFullYear()) - 1
        : activeFilter.year ?? now.getFullYear(),
  };
  const lastMonthRange = buildDateRange(lastMonthFilter);

  const [
    totalMembers,
    totalStaff,
    activeStaff,

    fridayAgg,
    memberPayAgg,
    lastMonthPayAgg,

    salaryAgg,
    purchaseAgg,

    otherCollCount,
    ramadanDoners,
    upcomingDues,
  ] = await Promise.all([
    prisma.member.count({ where: { mosqueId } }),
    prisma.staff.count({ where: { mosqueId } }),
    prisma.staff.count({ where: { mosqueId, active: true } }),

    // Friday collections
    prisma.fridayCollection.aggregate({
      where: {
        mosqueId,
        ...(dateRange ? { collectionDate: dateRange } : {}),
      },
      _sum: { amount: true },
      _count: true,
    }),

    // Member payments
    prisma.payment.aggregate({
      where: {
        mosqueId,
        ...(monthKey
          ? { monthKey }
          : dateRange
          ? { paidDate: dateRange }
          : {}),
      },
      _sum: { amount: true },
      _count: true,
    }),

    // Last month payments (for growth %)
    prisma.payment.aggregate({
      where: {
        mosqueId,
        ...(lastMonthRange ? { paidDate: lastMonthRange } : {}),
      },
      _sum: { amount: true },
    }),

    // Salary payments
    prisma.salaryPayment.aggregate({
      where: {
        mosqueId,
        ...(dateRange ? { payDate: dateRange } : {}),
      },
      _sum: { amount: true },
    }),

    // Purchases
    prisma.memberAccessoryPurchase.aggregate({
      where: {
        mosqueId,
        ...(dateRange ? { purchaseDate: dateRange } : {}),
      },
      _sum: { totalPrice: true },
      _count: true,
    }),

    // Other collections count
    prisma.otherCollection.count({
      where: {
        mosqueId,
        ...(dateRange ? { createdAt: dateRange } : {}),
      },
    }),

    // Ramadan donors
    prisma.doner.count({ where: { mosqueId } }),

    // Unpaid members this period
    prisma.member.findMany({
      where: {
        mosqueId,
        payments: { none: { monthKey: currentMonthKey } },
      },
      select: { id: true, name: true, phone: true, monthlyAmount: true },
      take: 5,
    }),
  ]);

  const totalIncome =
    (fridayAgg._sum.amount ?? 0) + (memberPayAgg._sum.amount ?? 0);
  const totalExpense =
    (salaryAgg._sum.amount ?? 0) + (purchaseAgg._sum.totalPrice ?? 0);
  const net = totalIncome - totalExpense;

  const lastMonthIncome = lastMonthPayAgg._sum.amount ?? 0;
  const incomeGrowth =
    lastMonthIncome > 0
      ? (((memberPayAgg._sum.amount ?? 0) - lastMonthIncome) / lastMonthIncome) * 100
      : 0;

  return {
    filter: activeFilter,
    overview: {
      totalIncome:   Number(totalIncome.toFixed(2)),
      totalExpense:  Number(totalExpense.toFixed(2)),
      netBalance:    Number(net.toFixed(2)),
      isProfit:      net >= 0,
      incomeGrowthPercent: Number(incomeGrowth.toFixed(1)),
    },
    collections: {
      friday: {
        total: Number((fridayAgg._sum.amount ?? 0).toFixed(2)),
        count: fridayAgg._count,
      },
      member: {
        total: Number((memberPayAgg._sum.amount ?? 0).toFixed(2)),
        count: memberPayAgg._count,
      },
      other: { count: otherCollCount },
    },
    expenses: {
      salary:   Number((salaryAgg._sum.amount ?? 0).toFixed(2)),
      purchase: Number((purchaseAgg._sum.totalPrice ?? 0).toFixed(2)),
      total:    Number(totalExpense.toFixed(2)),
    },
    members: {
      total: totalMembers,
      unpaidThisPeriod: totalMembers - (memberPayAgg._count ?? 0),
      upcomingDues,
    },
    staff: {
      total:  totalStaff,
      active: activeStaff,
    },
    ramadan: { totalDoners: ramadanDoners },
  };
};

// ===================== FILTERED COLLECTIONS =====================

const getFilteredCollectionsDB = async (
  mosqueId: string,
  filter: DateFilter,
  type: "friday" | "member" | "other" | "all"
) => {
  const dateRange = buildDateRange(filter);
  const monthKey  = buildMonthKey(filter);

  const results: Record<string, any> = {};

  if (type === "friday" || type === "all") {
    results.friday = await prisma.fridayCollection.findMany({
      where: {
        mosqueId,
        ...(dateRange ? { collectionDate: dateRange } : {}),
      },
      include: { user: { select: { name: true } } },
      orderBy: { collectionDate: "desc" },
    });
  }

  if (type === "member" || type === "all") {
    results.member = await prisma.payment.findMany({
      where: {
        mosqueId,
        ...(monthKey
          ? { monthKey }
          : dateRange
          ? { paidDate: dateRange }
          : {}),
      },
      include: {
        member: { select: { name: true, phone: true } },
        user:   { select: { name: true } },
      },
      orderBy: { paidDate: "desc" },
    });
  }

  if (type === "other" || type === "all") {
    results.other = await prisma.otherCollection.findMany({
      where: {
        mosqueId,
        ...(dateRange ? { createdAt: dateRange } : {}),
      },
      include: {
        otherCollectionName: { select: { title: true } },
        donors: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  return results;
};

// ===================== FILTERED EXPENSES =====================

const getFilteredExpensesDB = async (
  mosqueId: string,
  filter: DateFilter,
  type: "salary" | "purchase" | "tarabi" | "all"
) => {
  const dateRange = buildDateRange(filter);
  const results: Record<string, any> = {};

  if (type === "salary" || type === "all") {
    results.salary = await prisma.salaryPayment.findMany({
      where: {
        mosqueId,
        ...(dateRange ? { payDate: dateRange } : {}),
      },
      include: {
        salary: {
          include: { staff: { select: { name: true, role: true } } },
        },
      },
      orderBy: { payDate: "desc" },
    });
  }

  if (type === "purchase" || type === "all") {
    results.purchase = await prisma.memberAccessoryPurchase.findMany({
      where: {
        mosqueId,
        ...(dateRange ? { purchaseDate: dateRange } : {}),
      },
      include: { user: { select: { name: true } } },
      orderBy: { purchaseDate: "desc" },
    });
  }

  if (type === "tarabi" || type === "all") {
    results.tarabi = await prisma.ramadanTarabiPayment.findMany({
      where: {
        mosqueId,
        ...(dateRange ? { payDate: dateRange } : {}),
      },
      include: {
        member:      { select: { name: true } },
        ramadanYear: { select: { ramadanYear: true } },
      },
      orderBy: { payDate: "desc" },
    });
  }

  return results;
};

// ===================== MONTHLY CHART =====================

const getMonthlyCollectionChartDB = async (mosqueId: string, year: number) => {
  const startOfYear = new Date(year, 0, 1, 0, 0, 0);
  const endOfYear   = new Date(year, 11, 31, 23, 59, 59);

  const [paymentsGrouped, fridayCollections, salaryPayments, purchases] = await Promise.all([
    prisma.payment.groupBy({
      by: ["monthKey"],
      where: {
        mosqueId,
        monthKey: {
          startsWith: `${year}-`,
        },
      },
      _sum: {
        amount: true,
      },
    }),
    prisma.fridayCollection.findMany({
      where: {
        mosqueId,
        collectionDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        collectionDate: true,
        amount: true,
      },
    }),
    prisma.salaryPayment.findMany({
      where: {
        mosqueId,
        payDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        payDate: true,
        amount: true,
      },
    }),
    prisma.memberAccessoryPurchase.findMany({
      where: {
        mosqueId,
        purchaseDate: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      select: {
        purchaseDate: true,
        totalPrice: true,
      },
    }),
  ]);

  const months = Array.from({ length: 12 }, (_, i) => i);

  const chartData = months.map((monthIndex) => {
    const monthNumber = monthIndex + 1;
    const monthKey = `${year}-${String(monthNumber).padStart(2, "0")}`;

    // 1. Member payments sum for this month from groupBy result
    const memberPaymentObj = paymentsGrouped.find((p) => p.monthKey === monthKey);
    const memberPaymentsSum = memberPaymentObj?._sum?.amount ?? 0;

    // 2. Friday collection sum for this month
    let fridaySum = 0;
    for (const fc of fridayCollections) {
      const date = new Date(fc.collectionDate);
      if (date.getMonth() === monthIndex) {
        fridaySum += fc.amount;
      }
    }

    // 3. Salary payment sum for this month
    let salarySum = 0;
    for (const sp of salaryPayments) {
      const date = new Date(sp.payDate);
      if (date.getMonth() === monthIndex) {
        salarySum += sp.amount;
      }
    }

    // 4. Accessory purchase sum for this month
    let purchaseSum = 0;
    for (const p of purchases) {
      const date = new Date(p.purchaseDate);
      if (date.getMonth() === monthIndex) {
        purchaseSum += p.totalPrice;
      }
    }

    const income  = fridaySum + memberPaymentsSum;
    const expense = salarySum + purchaseSum;

    return {
      month:            new Date(year, monthIndex).toLocaleString("default", { month: "short" }),
      monthIndex:       monthNumber,
      fridayCollection: Number(fridaySum.toFixed(2)),
      memberPayments:   Number(memberPaymentsSum.toFixed(2)),
      totalIncome:      Number(income.toFixed(2)),
      salaryExpense:    Number(salarySum.toFixed(2)),
      purchaseExpense:  Number(purchaseSum.toFixed(2)),
      totalExpense:     Number(expense.toFixed(2)),
      net:              Number((income - expense).toFixed(2)),
    };
  });

  return {
    year,
    data: chartData,
    summary: {
      totalIncome:  chartData.reduce((s, d) => s + d.totalIncome, 0),
      totalExpense: chartData.reduce((s, d) => s + d.totalExpense, 0),
      netBalance:   chartData.reduce((s, d) => s + d.net, 0),
    },
  };
};

// ===================== RECENT ACTIVITIES =====================

const getRecentActivitiesDB = async (mosqueId: string, limit: number) => {
  const perSource = Math.max(3, Math.floor(limit / 4));

  const [recentFriday, recentPayments, recentPurchases, recentMembers, recentStaff] =
    await Promise.all([
      prisma.fridayCollection.findMany({
        where: { mosqueId },
        orderBy: { createdAt: "desc" },
        take: perSource,
        include: { user: { select: { name: true } } },
      }),
      prisma.payment.findMany({
        where: { mosqueId },
        orderBy: { createdAt: "desc" },
        take: perSource,
        include: {
          member: { select: { name: true } },
          user:   { select: { name: true } },
        },
      }),
      prisma.memberAccessoryPurchase.findMany({
        where: { mosqueId },
        orderBy: { createdAt: "desc" },
        take: perSource,
        include: { user: { select: { name: true } } },
      }),
      prisma.member.findMany({
        where: { mosqueId },
        orderBy: { createdAt: "desc" },
        take: perSource,
        include: { user: { select: { name: true } } },
      }),
      prisma.staff.findMany({
        where: { mosqueId },
        orderBy: { createdAt: "desc" },
        take: perSource,
      }),
    ]);

  const activities: Array<{
    id: string; type: string; title: string; description: string;
    amount?: number; date: Date; by?: string; badge: string;
  }> = [];

  recentFriday.forEach((fc: any) => {
    activities.push({
      id: fc.id, type: "friday_collection", title: "Friday Collection",
      description: `Collected on ${new Date(fc.collectionDate).toLocaleDateString()}`,
      amount: fc.amount, date: fc.createdAt, by: fc.user?.name, badge: "income",
    });
  });

  recentPayments.forEach((p: any) => {
    activities.push({
      id: p.id, type: "member_payment", title: "Member Payment",
      description: `${p.member?.name} paid for ${p.monthKey}`,
      amount: p.amount, date: p.createdAt, by: p.user?.name, badge: "income",
    });
  });

  recentPurchases.forEach((pur: any) => {
    activities.push({
      id: pur.id, type: "purchase", title: "Purchase",
      description: `${pur.itemName} (x${pur.quantity})`,
      amount: pur.totalPrice, date: pur.createdAt, by: pur.user?.name, badge: "expense",
    });
  });

  recentMembers.forEach((m: any) => {
    activities.push({
      id: m.id, type: "new_member", title: "New Member",
      description: `${m.name} joined the mosque`,
      date: m.createdAt, by: m.user?.name, badge: "member",
    });
  });

  recentStaff.forEach((s: any) => {
    activities.push({
      id: s.id, type: "new_staff", title: "Staff Added",
      description: `${s.name} - ${s.role}`,
      date: s.createdAt, badge: "staff",
    });
  });

  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  return activities.slice(0, limit);
};

// ===================== MEMBER PAYMENT STATUS =====================

const getMemberPaymentStatusDB = async (mosqueId: string, monthParam?: string) => {
  const now = new Date();
  const monthKey =
    monthParam ?? `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [allMembers, paidAgg] = await Promise.all([
    prisma.member.findMany({
      where: { mosqueId },
      select: {
        id: true, name: true, phone: true, monthlyAmount: true,
        payments: {
          where: { monthKey },
          select: { id: true, amount: true, paidDate: true, monthKey: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.payment.aggregate({
      where: { mosqueId, monthKey },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  const paid   = allMembers.filter((m: any) => m.payments.length > 0);
  const unpaid = allMembers.filter((m: any) => m.payments.length === 0);
  const expectedTotal  = allMembers.reduce((s: number, m: any) => s + m.monthlyAmount, 0);
  const collectedTotal = paidAgg._sum.amount ?? 0;

  return {
    monthKey,
    summary: {
      totalMembers:    allMembers.length,
      paidCount:       paid.length,
      unpaidCount:     unpaid.length,
      paymentRate:     allMembers.length > 0 ? Number(((paid.length / allMembers.length) * 100).toFixed(1)) : 0,
      expectedAmount:  Number(expectedTotal.toFixed(2)),
      collectedAmount: Number(collectedTotal.toFixed(2)),
      pendingAmount:   Number((expectedTotal - collectedTotal).toFixed(2)),
    },
    paid: paid.map((m: any) => ({
      id: m.id, name: m.name, phone: m.phone, monthlyAmount: m.monthlyAmount,
      paidAmount: m.payments[0]?.amount, paidDate: m.payments[0]?.paidDate,
    })),
    unpaid: unpaid.map((m: any) => ({ id: m.id, name: m.name, phone: m.phone, monthlyAmount: m.monthlyAmount })),
  };
};

// ===================== STAFF SALARY OVERVIEW =====================

const getStaffSalaryOverviewDB = async (mosqueId: string) => {
  const now              = new Date();
  const currentMonthKey  = new Date(now.getFullYear(), now.getMonth(), 1);

  const staffList = await prisma.staff.findMany({
    where: { mosqueId, active: true },
    include: {
      salaries: {
        where: { month: currentMonthKey },
        include: { payments: { select: { amount: true, payDate: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  const overview = staffList.map((staff: any) => {
    const salary = staff.salaries[0];
    const paid   = salary ? salary.payments.reduce((s: number, p: any) => s + p.amount, 0) : 0;
    const due    = salary ? salary.totalSalary - paid : staff.baseSalary;

    return {
      id: staff.id, name: staff.name, role: staff.role,
      baseSalary: staff.baseSalary,
      thisMonthTotal: salary?.totalSalary ?? staff.baseSalary,
      paid:   Number(paid.toFixed(2)),
      due:    Number(due.toFixed(2)),
      status: paid >= (salary?.totalSalary ?? staff.baseSalary) ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID",
    };
  });

  return {
    month:          currentMonthKey,
    staffCount:     staffList.length,
    totalSalaryDue: overview.reduce((s: number, o: any) => s + o.thisMonthTotal, 0),
    totalPaid:      overview.reduce((s: number, o: any) => s + o.paid, 0),
    totalDue:       overview.reduce((s: number, o: any) => s + o.due, 0),
    staff:          overview,
  };
};

export const DashboardServices = {
  getDashboardStatsDB,
  getFilteredCollectionsDB,
  getFilteredExpensesDB,
  getMonthlyCollectionChartDB,
  getRecentActivitiesDB,
  getMemberPaymentStatusDB,
  getStaffSalaryOverviewDB,
};