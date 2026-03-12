import prisma from "../../utils/prisma";

const getDashboardStatsDB = async (mosqueId: string) => {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  // Run all queries in parallel
  const [
    totalMembers,
    activeMembers,
    totalStaff,
    activeStaff,

    totalFridayCollection,
    currentMonthFridayCollection,

    totalMemberPayments,
    currentMonthMemberPayments,
    lastMonthMemberPayments,

    totalOtherCollections,
    currentMonthOtherCollections,

    totalSalaryPaid,
    currentMonthSalaryPaid,

    totalPurchases,
    currentMonthPurchases,

    totalRamadanDoners,
    upcomingPaymentDues,
  ] = await Promise.all([
    // Members
    prisma.member.count({ where: { mosqueId } }),
    prisma.member.count({ where: { mosqueId } }), // all members counted as active (no status field)

    // Staff
    prisma.staff.count({ where: { mosqueId } }),
    prisma.staff.count({ where: { mosqueId, active: true } }),

    // Friday Collection - total amount
    prisma.fridayCollection.aggregate({
      where: { mosqueId },
      _sum: { amount: true },
      _count: true,
    }),

    // Friday Collection - current month
    prisma.fridayCollection.aggregate({
      where: {
        mosqueId,
        collectionDate: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
      _count: true,
    }),

    // Member Payments - total
    prisma.payment.aggregate({
      where: { mosqueId },
      _sum: { amount: true },
      _count: true,
    }),

    // Member Payments - current month
    prisma.payment.aggregate({
      where: {
        mosqueId,
        monthKey: currentMonthKey,
      },
      _sum: { amount: true },
      _count: true,
    }),

    // Member Payments - last month (for comparison)
    prisma.payment.aggregate({
      where: {
        mosqueId,
        paidDate: { gte: lastMonthStart, lte: lastMonthEnd },
      },
      _sum: { amount: true },
    }),

    // Other Collections - total
    prisma.otherCollection.aggregate({
      where: { mosqueId },
      _count: true,
    }),

    // Other Collections - current month
    prisma.otherCollection.count({
      where: {
        mosqueId,
        createdAt: { gte: currentMonthStart, lte: currentMonthEnd },
      },
    }),

    // Salary Payments - total paid
    prisma.salaryPayment.aggregate({
      where: { mosqueId },
      _sum: { amount: true },
    }),

    // Salary Payments - current month
    prisma.salaryPayment.aggregate({
      where: {
        mosqueId,
        payDate: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { amount: true },
    }),

    // Purchases - total
    prisma.memberAccessoryPurchase.aggregate({
      where: { mosqueId },
      _sum: { totalPrice: true },
      _count: true,
    }),

    // Purchases - current month
    prisma.memberAccessoryPurchase.aggregate({
      where: {
        mosqueId,
        purchaseDate: { gte: currentMonthStart, lte: currentMonthEnd },
      },
      _sum: { totalPrice: true },
    }),

    // Ramadan Donors count
    prisma.doner.count({ where: { mosqueId } }),

    // Members who haven't paid this month
    prisma.member.findMany({
      where: {
        mosqueId,
        payments: {
          none: { monthKey: currentMonthKey },
        },
      },
      select: {
        id: true,
        name: true,
        phone: true,
        monthlyAmount: true,
      },
      take: 5,
    }),
  ]);

  const totalIncome =
    (totalFridayCollection._sum.amount || 0) +
    (totalMemberPayments._sum.amount || 0);

  const totalExpense =
    (totalSalaryPaid._sum.amount || 0) +
    (totalPurchases._sum.totalPrice || 0);

  const currentMonthIncome =
    (currentMonthFridayCollection._sum.amount || 0) +
    (currentMonthMemberPayments._sum.amount || 0) +
    (currentMonthOtherCollections || 0);

  const currentMonthExpense =
    (currentMonthSalaryPaid._sum.amount || 0) +
    (currentMonthPurchases._sum.totalPrice || 0);

  const lastMonthTotalIncome = lastMonthMemberPayments._sum.amount || 0;
  const incomeGrowth =
    lastMonthTotalIncome > 0
      ? (((currentMonthMemberPayments._sum.amount || 0) - lastMonthTotalIncome) /
          lastMonthTotalIncome) *
        100
      : 0;

  return {
    mosque: {
      id: mosqueId,
    },
    overview: {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      netBalance: Number((totalIncome - totalExpense).toFixed(2)),
      currentMonthIncome: Number(currentMonthIncome.toFixed(2)),
      currentMonthExpense: Number(currentMonthExpense.toFixed(2)),
      currentMonthNet: Number(
        (currentMonthIncome - currentMonthExpense).toFixed(2)
      ),
      incomeGrowthPercent: Number(incomeGrowth.toFixed(1)),
    },
    collections: {
      friday: {
        total: Number((totalFridayCollection._sum.amount || 0).toFixed(2)),
        count: totalFridayCollection._count,
        thisMonth: Number(
          (currentMonthFridayCollection._sum.amount || 0).toFixed(2)
        ),
        thisMonthCount: currentMonthFridayCollection._count,
      },
      member: {
        total: Number((totalMemberPayments._sum.amount || 0).toFixed(2)),
        count: totalMemberPayments._count,
        thisMonth: Number(
          (currentMonthMemberPayments._sum.amount || 0).toFixed(2)
        ),
        thisMonthCount: currentMonthMemberPayments._count,
      },
      other: {
        totalEvents: totalOtherCollections._count,
        thisMonthEvents: currentMonthOtherCollections,
      },
    },
    members: {
      total: totalMembers,
      active: activeMembers,
      unpaidThisMonth: totalMembers - currentMonthMemberPayments._count,
      upcomingDues: upcomingPaymentDues,
    },
    staff: {
      total: totalStaff,
      active: activeStaff,
      totalSalaryPaid: Number((totalSalaryPaid._sum.amount || 0).toFixed(2)),
      thisMonthSalaryPaid: Number(
        (currentMonthSalaryPaid._sum.amount || 0).toFixed(2)
      ),
    },
    purchases: {
      totalAmount: Number((totalPurchases._sum.totalPrice || 0).toFixed(2)),
      totalCount: totalPurchases._count,
      thisMonthAmount: Number(
        (currentMonthPurchases._sum.totalPrice || 0).toFixed(2)
      ),
    },
    ramadan: {
      totalDoners: totalRamadanDoners,
    },
  };
};

// ===================== MONTHLY COLLECTION CHART =====================
const getMonthlyCollectionChartDB = async (
  mosqueId: string,
  year: number
) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  const chartData = await Promise.all(
    months.map(async (monthIndex) => {
      const start = new Date(year, monthIndex, 1);
      const end = new Date(year, monthIndex + 1, 0, 23, 59, 59);
      const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

      const [friday, member, salary, purchase] = await Promise.all([
        prisma.fridayCollection.aggregate({
          where: {
            mosqueId,
            collectionDate: { gte: start, lte: end },
          },
          _sum: { amount: true },
        }),
        prisma.payment.aggregate({
          where: { mosqueId, monthKey },
          _sum: { amount: true },
        }),
        prisma.salaryPayment.aggregate({
          where: { mosqueId, payDate: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
        prisma.memberAccessoryPurchase.aggregate({
          where: { mosqueId, purchaseDate: { gte: start, lte: end } },
          _sum: { totalPrice: true },
        }),
      ]);

      const income =
        (friday._sum.amount || 0) + (member._sum.amount || 0);
      const expense =
        (salary._sum.amount || 0) + (purchase._sum.totalPrice || 0);

      return {
        month: new Date(year, monthIndex, 1).toLocaleString("default", {
          month: "short",
        }),
        monthIndex: monthIndex + 1,
        fridayCollection: Number((friday._sum.amount || 0).toFixed(2)),
        memberPayments: Number((member._sum.amount || 0).toFixed(2)),
        totalIncome: Number(income.toFixed(2)),
        salaryExpense: Number((salary._sum.amount || 0).toFixed(2)),
        purchaseExpense: Number((purchase._sum.totalPrice || 0).toFixed(2)),
        totalExpense: Number(expense.toFixed(2)),
        net: Number((income - expense).toFixed(2)),
      };
    })
  );

  return {
    year,
    data: chartData,
    summary: {
      totalIncome: chartData.reduce((s, d) => s + d.totalIncome, 0),
      totalExpense: chartData.reduce((s, d) => s + d.totalExpense, 0),
      netBalance: chartData.reduce((s, d) => s + d.net, 0),
    },
  };
};

// ===================== RECENT ACTIVITIES =====================
const getRecentActivitiesDB = async (mosqueId: string, limit: number) => {
  const perSource = Math.max(3, Math.floor(limit / 4));

  const [
    recentFriday,
    recentPayments,
    recentPurchases,
    recentMembers,
    recentStaff,
  ] = await Promise.all([
    prisma.fridayCollection.findMany({
      where: { mosqueId },
      orderBy: { createdAt: "desc" },
      take: perSource,
      include: {
        user: { select: { name: true } },
      },
    }),

    prisma.payment.findMany({
      where: { mosqueId },
      orderBy: { createdAt: "desc" },
      take: perSource,
      include: {
        member: { select: { name: true } },
        user: { select: { name: true } },
      },
    }),

    prisma.memberAccessoryPurchase.findMany({
      where: { mosqueId },
      orderBy: { createdAt: "desc" },
      take: perSource,
      include: {
        user: { select: { name: true } },
      },
    }),

    prisma.member.findMany({
      where: { mosqueId },
      orderBy: { createdAt: "desc" },
      take: perSource,
      include: {
        user: { select: { name: true } },
      },
    }),

    prisma.staff.findMany({
      where: { mosqueId },
      orderBy: { createdAt: "desc" },
      take: perSource,
    }),
  ]);

  const activities: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    amount?: number;
    date: Date;
    by?: string;
    badge: string;
  }> = [];

  recentFriday.forEach((fc:any) => {
    activities.push({
      id: fc.id,
      type: "friday_collection",
      title: "Friday Collection",
      description: `Collected on ${new Date(fc.collectionDate).toLocaleDateString()}`,
      amount: fc.amount,
      date: fc.createdAt,
      by: fc.user?.name,
      badge: "income",
    });
  });

  recentPayments.forEach((p:any) => {
    activities.push({
      id: p.id,
      type: "member_payment",
      title: "Member Payment",
      description: `${p.member?.name} paid for ${p.monthKey}`,
      amount: p.amount,
      date: p.createdAt,
      by: p.user?.name,
      badge: "income",
    });
  });

  recentPurchases.forEach((pur:any) => {
    activities.push({
      id: pur.id,
      type: "purchase",
      title: "Purchase",
      description: `${pur.itemName} (x${pur.quantity})`,
      amount: pur.totalPrice,
      date: pur.createdAt,
      by: pur.user?.name,
      badge: "expense",
    });
  });

  recentMembers.forEach((m:any) => {
    activities.push({
      id: m.id,
      type: "new_member",
      title: "New Member",
      description: `${m.name} joined the mosque`,
      date: m.createdAt,
      by: m.user?.name,
      badge: "member",
    });
  });

  recentStaff.forEach((s:any) => {
    activities.push({
      id: s.id,
      type: "new_staff",
      title: "Staff Added",
      description: `${s.name} - ${s.role}`,
      date: s.createdAt,
      badge: "staff",
    });
  });

  // Sort by date desc & slice to limit
  activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  return activities.slice(0, limit);
};

// ===================== MEMBER PAYMENT STATUS =====================
const getMemberPaymentStatusDB = async (
  mosqueId: string,
  monthParam?: string
) => {
  const now = new Date();
  const monthKey =
    monthParam ||
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const [allMembers, paidMembers] = await Promise.all([
    prisma.member.findMany({
      where: { mosqueId },
      select: {
        id: true,
        name: true,
        phone: true,
        monthlyAmount: true,
        payments: {
          where: { monthKey },
          select: {
            id: true,
            amount: true,
            paidDate: true,
            monthKey: true,
          },
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

  const paid = allMembers.filter((m:any) => m.payments.length > 0);
  const unpaid = allMembers.filter((m:any) => m.payments.length === 0);

  const expectedTotal = allMembers.reduce((s:number, m:any) => s + m.monthlyAmount, 0);
  const collectedTotal = paidMembers._sum.amount || 0;

  return {
    monthKey,
    summary: {
      totalMembers: allMembers.length,
      paidCount: paid.length,
      unpaidCount: unpaid.length,
      paymentRate:
        allMembers.length > 0
          ? Number(((paid.length / allMembers.length) * 100).toFixed(1))
          : 0,
      expectedAmount: Number(expectedTotal.toFixed(2)),
      collectedAmount: Number(collectedTotal.toFixed(2)),
      pendingAmount: Number((expectedTotal - collectedTotal).toFixed(2)),
    },
    paid: paid.map((m:any) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      monthlyAmount: m.monthlyAmount,
      paidAmount: m.payments[0]?.amount,
      paidDate: m.payments[0]?.paidDate,
    })),
    unpaid: unpaid.map((m:any) => ({
      id: m.id,
      name: m.name,
      phone: m.phone,
      monthlyAmount: m.monthlyAmount,
    })),
  };
};

// ===================== STAFF SALARY OVERVIEW =====================
const getStaffSalaryOverviewDB = async (mosqueId: string) => {
  const now = new Date();
  const currentMonthKey = new Date(now.getFullYear(), now.getMonth(), 1);

  const staffList = await prisma.staff.findMany({
    where: { mosqueId, active: true },
    include: {
      salaries: {
        where: { month: currentMonthKey },
        include: {
          payments: {
            select: { amount: true, payDate: true },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const overview = staffList.map((staff:any) => {
    const salary = staff.salaries[0];
    const paid = salary
      ? salary.payments.reduce((s:number, p:any) => s + p.amount, 0)
      : 0;
    const due = salary ? salary.totalSalary - paid : staff.baseSalary;

    return {
      id: staff.id,
      name: staff.name,
      role: staff.role,
      baseSalary: staff.baseSalary,
      thisMonthTotal: salary?.totalSalary || staff.baseSalary,
      paid: Number(paid.toFixed(2)),
      due: Number(due.toFixed(2)),
      status: paid >= (salary?.totalSalary || staff.baseSalary) ? "PAID" : paid > 0 ? "PARTIAL" : "UNPAID",
    };
  });

  return {
    month: currentMonthKey,
    staffCount: staffList.length,
    totalSalaryDue: overview.reduce((s:number, o:any) => s + o.thisMonthTotal, 0),
    totalPaid: overview.reduce((s:number, o:any) => s + o.paid, 0),
    totalDue: overview.reduce((s:number, o:any) => s + o.due, 0),
    staff: overview,
  };
};

export const DashboardServices = {
  getDashboardStatsDB,
  getMonthlyCollectionChartDB,
  getRecentActivitiesDB,
  getMemberPaymentStatusDB,
  getStaffSalaryOverviewDB,
};