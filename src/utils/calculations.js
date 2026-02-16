/**
 * FinanceCalc — Core Calculation Engine
 * Production-grade financial calculation functions
 */

/**
 * Compound Interest Calculator
 * @param {number} principal - Initial investment
 * @param {number} monthlyContribution - Monthly contribution amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} years - Investment duration in years
 * @returns {Object} Calculation results with annual breakdown
 */
export function calculateCompoundInterest(principal, monthlyContribution, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const breakdown = [];
    let balance = principal;
    let totalContributions = principal;
    let totalInterest = 0;

    for (let year = 1; year <= years; year++) {
        let yearlyInterest = 0;
        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyRate;
            yearlyInterest += interest;
            balance += interest + monthlyContribution;
        }
        totalContributions += monthlyContribution * 12;
        totalInterest += yearlyInterest;
        breakdown.push({
            year,
            balance: Math.round(balance * 100) / 100,
            totalContributions: Math.round(totalContributions * 100) / 100,
            yearlyInterest: Math.round(yearlyInterest * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
        });
    }

    return {
        finalBalance: Math.round(balance * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        breakdown,
    };
}

/**
 * Loan Payoff / Amortization Calculator
 * @param {number} loanAmount - Total loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} monthlyPayment - Monthly payment amount
 * @returns {Object} Amortization schedule and summary
 */
export function calculateLoanPayoff(loanAmount, annualRate, monthlyPayment) {
    const monthlyRate = annualRate / 100 / 12;
    const minPayment = loanAmount * monthlyRate;

    if (monthlyPayment <= minPayment) {
        return {
            error: `Monthly payment must be greater than $${minPayment.toFixed(2)} to pay off this loan.`,
        };
    }

    const schedule = [];
    let balance = loanAmount;
    let totalInterest = 0;
    let month = 0;

    while (balance > 0 && month < 600) {
        month++;
        const interest = balance * monthlyRate;
        const principalPaid = Math.min(monthlyPayment - interest, balance);
        const payment = Math.min(monthlyPayment, balance + interest);
        balance -= principalPaid;
        totalInterest += interest;

        schedule.push({
            month,
            payment: Math.round(payment * 100) / 100,
            principal: Math.round(principalPaid * 100) / 100,
            interest: Math.round(interest * 100) / 100,
            balance: Math.max(0, Math.round(balance * 100) / 100),
            totalInterest: Math.round(totalInterest * 100) / 100,
        });

        if (balance <= 0.01) break;
    }

    // Annual summary
    const annualSummary = [];
    for (let i = 0; i < schedule.length; i += 12) {
        const yearSlice = schedule.slice(i, i + 12);
        const yearNum = Math.floor(i / 12) + 1;
        annualSummary.push({
            year: yearNum,
            totalPayments: yearSlice.reduce((s, m) => s + m.payment, 0),
            totalPrincipal: yearSlice.reduce((s, m) => s + m.principal, 0),
            totalInterest: yearSlice.reduce((s, m) => s + m.interest, 0),
            endBalance: yearSlice[yearSlice.length - 1].balance,
        });
    }

    return {
        totalMonths: month,
        totalYears: Math.round((month / 12) * 10) / 10,
        totalPayments: Math.round((totalInterest + loanAmount) * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        schedule,
        annualSummary,
    };
}

/**
 * Retirement Calculator
 * @param {number} currentAge - Current age
 * @param {number} retirementAge - Target retirement age
 * @param {number} currentSavings - Current savings amount
 * @param {number} monthlyContribution - Monthly contribution
 * @param {number} expectedReturn - Expected annual return rate (percentage)
 * @param {number} withdrawalRate - Safe withdrawal rate (percentage, default 4%)
 * @returns {Object} Retirement projection
 */
export function calculateRetirement(currentAge, retirementAge, currentSavings, monthlyContribution, expectedReturn, withdrawalRate = 4) {
    const years = retirementAge - currentAge;
    if (years <= 0) return { error: 'Retirement age must be greater than current age.' };

    const monthlyRate = expectedReturn / 100 / 12;
    const projection = [];
    let balance = currentSavings;
    let totalContributions = currentSavings;

    for (let year = 1; year <= years; year++) {
        let yearlyInterest = 0;
        for (let month = 1; month <= 12; month++) {
            const interest = balance * monthlyRate;
            yearlyInterest += interest;
            balance += interest + monthlyContribution;
        }
        totalContributions += monthlyContribution * 12;
        projection.push({
            age: currentAge + year,
            year,
            balance: Math.round(balance * 100) / 100,
            totalContributions: Math.round(totalContributions * 100) / 100,
            yearlyGrowth: Math.round(yearlyInterest * 100) / 100,
        });
    }

    const retirementCorpus = Math.round(balance * 100) / 100;
    const annualWithdrawal = Math.round(balance * (withdrawalRate / 100) * 100) / 100;
    const monthlyWithdrawal = Math.round((annualWithdrawal / 12) * 100) / 100;
    const corpusLastsYears = Math.round(retirementCorpus / annualWithdrawal);

    return {
        retirementCorpus,
        totalContributions: Math.round(totalContributions * 100) / 100,
        totalGrowth: Math.round((retirementCorpus - totalContributions) * 100) / 100,
        annualWithdrawal,
        monthlyWithdrawal,
        corpusLastsYears,
        projection,
    };
}

/**
 * Inflation Calculator
 * @param {number} currentValue - Current monetary value
 * @param {number} years - Number of years
 * @param {number} inflationRate - Annual inflation rate (percentage)
 * @returns {Object} Inflation-adjusted projections
 */
export function calculateInflation(currentValue, years, inflationRate) {
    const yearlyData = [];
    const rate = inflationRate / 100;

    for (let year = 1; year <= years; year++) {
        const futureValue = currentValue * Math.pow(1 + rate, year);
        const purchasingPower = currentValue / Math.pow(1 + rate, year);
        const valueEroded = currentValue - purchasingPower;

        yearlyData.push({
            year,
            futureValue: Math.round(futureValue * 100) / 100,
            purchasingPower: Math.round(purchasingPower * 100) / 100,
            valueEroded: Math.round(valueEroded * 100) / 100,
            cumulativeInflation: Math.round((Math.pow(1 + rate, year) - 1) * 10000) / 100,
        });
    }

    const finalFutureValue = currentValue * Math.pow(1 + rate, years);
    const finalPurchasingPower = currentValue / Math.pow(1 + rate, years);

    return {
        currentValue,
        futureValue: Math.round(finalFutureValue * 100) / 100,
        purchasingPower: Math.round(finalPurchasingPower * 100) / 100,
        valueEroded: Math.round((currentValue - finalPurchasingPower) * 100) / 100,
        totalInflation: Math.round((Math.pow(1 + rate, years) - 1) * 10000) / 100,
        yearlyData,
    };
}

/**
 * Debt Snowball Calculator
 * @param {Array} debts - Array of debt objects {name, balance, rate, minPayment}
 * @param {number} extraPayment - Extra monthly payment available
 * @returns {Object} Optimized payoff plan
 */
export function calculateDebtSnowball(debts, extraPayment = 0) {
    if (!debts || debts.length === 0) return { error: 'Please add at least one debt.' };

    // Snowball: sort by balance (smallest first)
    const snowballDebts = [...debts].sort((a, b) => a.balance - b.balance);
    const snowballResult = simulatePayoff(snowballDebts, extraPayment);

    // Avalanche: sort by interest rate (highest first)
    const avalancheDebts = [...debts].sort((a, b) => b.rate - a.rate);
    const avalancheResult = simulatePayoff(avalancheDebts, extraPayment);

    // Minimum payments only
    const minimumResult = simulatePayoff([...debts], 0);

    // Normalize all three timelines to the same set of month checkpoints
    // so Chart.js can render all lines with identical x-axis labels
    const maxMonth = Math.max(
        snowballResult.totalMonths,
        avalancheResult.totalMonths,
        minimumResult.totalMonths
    );

    // Build unified checkpoints: every 12 months + each method's final month
    const checkpointSet = new Set();
    for (let m = 12; m <= maxMonth; m += 12) {
        checkpointSet.add(m);
    }
    checkpointSet.add(snowballResult.totalMonths);
    checkpointSet.add(avalancheResult.totalMonths);
    checkpointSet.add(minimumResult.totalMonths);
    const checkpoints = [...checkpointSet].sort((a, b) => a - b);

    // Re-sample each raw timeline to the unified checkpoints
    snowballResult.timeline = sampleTimeline(snowballResult.rawTimeline, checkpoints);
    avalancheResult.timeline = sampleTimeline(avalancheResult.rawTimeline, checkpoints);
    minimumResult.timeline = sampleTimeline(minimumResult.rawTimeline, checkpoints);

    // Clean up raw data
    delete snowballResult.rawTimeline;
    delete avalancheResult.rawTimeline;
    delete minimumResult.rawTimeline;

    return {
        snowball: snowballResult,
        avalanche: avalancheResult,
        minimumOnly: minimumResult,
        interestSavedSnowball: Math.round((minimumResult.totalInterest - snowballResult.totalInterest) * 100) / 100,
        interestSavedAvalanche: Math.round((minimumResult.totalInterest - avalancheResult.totalInterest) * 100) / 100,
        timeSavedSnowball: minimumResult.totalMonths - snowballResult.totalMonths,
        timeSavedAvalanche: minimumResult.totalMonths - avalancheResult.totalMonths,
    };
}

/**
 * Sample a raw monthly timeline at specific checkpoints.
 * For months beyond the payoff month, balance is 0.
 */
function sampleTimeline(rawTimeline, checkpoints) {
    return checkpoints.map(targetMonth => {
        // Find the entry for this month, or the closest one before it
        let entry = null;
        for (let i = rawTimeline.length - 1; i >= 0; i--) {
            if (rawTimeline[i].month <= targetMonth) {
                entry = rawTimeline[i];
                break;
            }
        }
        // If the payoff already happened, balance is 0
        const lastEntry = rawTimeline[rawTimeline.length - 1];
        if (!entry || (lastEntry && targetMonth > lastEntry.month && lastEntry.totalBalance === 0)) {
            return {
                month: targetMonth,
                totalBalance: 0,
                totalInterest: lastEntry ? lastEntry.totalInterest : 0,
                debtsRemaining: 0,
            };
        }
        return { ...entry, month: targetMonth };
    });
}

function simulatePayoff(debts, extraPayment) {
    const activeDebts = debts.map(d => ({
        ...d,
        currentBalance: d.balance,
        paidOff: false,
    }));

    let month = 0;
    let totalInterest = 0;
    let totalPaid = 0;
    const rawTimeline = [];

    while (activeDebts.some(d => !d.paidOff) && month < 600) {
        month++;
        let extra = extraPayment;

        // Add freed-up minimum payments from paid-off debts
        activeDebts.forEach(d => {
            if (d.paidOff) extra += d.minPayment;
        });

        let monthInterest = 0;
        let monthPaid = 0;

        activeDebts.forEach((debt, idx) => {
            if (debt.paidOff) return;

            const monthlyRate = debt.rate / 100 / 12;
            const interest = debt.currentBalance * monthlyRate;
            monthInterest += interest;

            let payment = debt.minPayment;
            // Apply extra to the first non-paid-off debt (snowball/avalanche target)
            if (idx === activeDebts.findIndex(d => !d.paidOff)) {
                payment += extra;
            }

            payment = Math.min(payment, debt.currentBalance + interest);
            const principal = payment - interest;
            debt.currentBalance = Math.max(0, debt.currentBalance - principal);
            monthPaid += payment;

            if (debt.currentBalance <= 0.01) {
                debt.paidOff = true;
                debt.currentBalance = 0;
            }
        });

        totalInterest += monthInterest;
        totalPaid += monthPaid;

        // Record every month for accurate resampling
        rawTimeline.push({
            month,
            totalBalance: Math.round(activeDebts.reduce((s, d) => s + d.currentBalance, 0) * 100) / 100,
            totalInterest: Math.round(totalInterest * 100) / 100,
            debtsRemaining: activeDebts.filter(d => !d.paidOff).length,
        });
    }

    return {
        totalMonths: month,
        totalYears: Math.round((month / 12) * 10) / 10,
        totalInterest: Math.round(totalInterest * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        rawTimeline,
        timeline: [], // will be filled by normalization in calculateDebtSnowball
        payoffOrder: debts.map(d => d.name),
    };
}

/**
 * SIP (Systematic Investment Plan) Calculator
 * @param {number} monthlyInvestment - Amount invested every month
 * @param {number} annualRate - Expected annual return rate (%)
 * @param {number} years - Duration of investment
 * @returns {Object} Wealth gained and maturity value
 */
export function calculateSIP(monthlyInvestment, annualRate, years) {
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    const maturityValue = monthlyInvestment * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvested = monthlyInvestment * months;

    const yearlyData = [];
    for (let y = 1; y <= years; y++) {
        const m = y * 12;
        const val = monthlyInvestment * (((Math.pow(1 + monthlyRate, m) - 1) / monthlyRate) * (1 + monthlyRate));
        yearlyData.push({
            year: y,
            investment: Math.round(monthlyInvestment * m),
            wealthGained: Math.round(val - (monthlyInvestment * m)),
            maturityValue: Math.round(val)
        });
    }

    return {
        totalInvested: Math.round(totalInvested),
        estReturns: Math.round(maturityValue - totalInvested),
        totalValue: Math.round(maturityValue),
        yearlyData
    };
}

/**
 * EMI (Equated Monthly Installment) Calculator
 * @param {number} principal - Loan amount
 * @param {number} rate - Annual interest rate (%)
 * @param {number} years - Tenure in years
 * @returns {Object} EMI amount and total payment breakdown
 */
export function calculateEMI(principal, rate, years) {
    const r = rate / 12 / 100;
    const n = years * 12;
    const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - principal;

    const schedule = [];
    let balance = principal;
    for (let i = 1; i <= n; i++) {
        const interest = balance * r;
        const principalPaid = emi - interest;
        balance -= principalPaid;
        if (i % 12 === 0 || i === n) {
            schedule.push({
                year: Math.ceil(i / 12),
                payment: Math.round(emi * 12),
                principalPaid: Math.round(principal - balance),
                interestPaid: Math.round((emi * i) - (principal - balance)),
                remainingBalance: Math.round(Math.max(0, balance))
            });
        }
    }

    return {
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment),
        schedule
    };
}

/**
 * India Income Tax Calculator (New Regime FY 2024-25)
 * @param {number} annualIncome - Gross annual salary
 * @returns {Object} Tax breakdown
 */
export function calculateIndiaTax(annualIncome) {
    const standardDeduction = 75000;
    const taxableIncome = Math.max(0, annualIncome - standardDeduction);
    let tax = 0;

    // Slabs for New Regime 2024-25
    if (taxableIncome <= 300000) {
        tax = 0;
    } else if (taxableIncome <= 700000) {
        tax = (taxableIncome - 300000) * 0.05;
    } else if (taxableIncome <= 1000000) {
        tax = (400000 * 0.05) + (taxableIncome - 700000) * 0.10;
    } else if (taxableIncome <= 1200000) {
        tax = (400000 * 0.05) + (300000 * 0.10) + (taxableIncome - 1000000) * 0.15;
    } else if (taxableIncome <= 1500000) {
        tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (taxableIncome - 1200000) * 0.20;
    } else {
        tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (300000 * 0.20) + (taxableIncome - 1500000) * 0.30;
    }

    // 87A Rebate (No tax up to ₹7L taxable income)
    if (taxableIncome <= 700000) tax = 0;

    const cess = tax * 0.04;
    const totalTax = tax + cess;

    return {
        taxableIncome: Math.round(taxableIncome),
        baseTax: Math.round(tax),
        cess: Math.round(cess),
        totalTax: Math.round(totalTax),
        takeHome: Math.round(annualIncome - totalTax),
        effectiveRate: ((totalTax / annualIncome) * 100).toFixed(2)
    };
}

/**
 * Credit Card Payoff Calculator
 * @param {number} balance - Current credit card debt
 * @param {number} rate - Annual interest rate (%)
 * @param {number} monthlyPayment - Monthly payment amount
 * @returns {Object} Payoff timeline
 */
export function calculateCreditCardPayoff(balance, rate, monthlyPayment) {
    return calculateLoanPayoff(balance, rate, monthlyPayment); // Reuses loan logic as it's identical math
}

/**
 * GST (Goods and Services Tax) Calculator
 * @param {number} amount - Original cost or net price
 * @param {number} rate - GST rate (%)
 * @param {boolean} inclusive - Whether the amount is GST inclusive
 * @returns {Object} GST amount and total price
 */
export function calculateGST(amount, rate, inclusive = false) {
    let gstAmount, netAmount, totalAmount;

    if (inclusive) {
        // GST = Total Amount - [Total Amount / (1 + Rate/100)]
        netAmount = amount / (1 + rate / 100);
        gstAmount = amount - netAmount;
        totalAmount = amount;
    } else {
        // GST = Amount * (Rate/100)
        gstAmount = amount * (rate / 100);
        netAmount = amount;
        totalAmount = amount + gstAmount;
    }

    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;

    return {
        amount,
        rate,
        inclusive,
        netAmount: Math.round(netAmount * 100) / 100,
        gstAmount: Math.round(gstAmount * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        cgst: Math.round(cgst * 100) / 100,
        sgst: Math.round(sgst * 100) / 100
    };
}

