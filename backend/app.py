"""
FinanceCalc — Flask Backend API
Production-ready REST API structure for financial calculations
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

# ✅ Create Flask app FIRST (prevents NameError)
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://localhost:5432/financecalc')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 📁 Frontend build folder
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_FOLDER = os.path.join(BASE_DIR, "dist")


# ─── Health Check ─────────────────────────────────────────────────────
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'version': '1.0.0',
        'service': 'FinanceCalc API'
    })


# ─── Compound Interest ────────────────────────────────────────────────
@app.route('/api/calculate/compound-interest', methods=['POST'])
def compound_interest():
    data = request.json
    try:
        principal = float(data.get('principal', 0))
        monthly = float(data.get('monthly', 0))
        rate = float(data.get('rate', 0))
        years = int(data.get('years', 0))

        monthly_rate = rate / 100 / 12
        breakdown = []
        balance = principal
        total_contributions = principal
        total_interest = 0

        for year in range(1, years + 1):
            yearly_interest = 0
            for month in range(1, 13):
                interest = balance * monthly_rate
                yearly_interest += interest
                balance += interest + monthly
            total_contributions += monthly * 12
            total_interest += yearly_interest
            breakdown.append({
                'year': year,
                'balance': round(balance, 2),
                'totalContributions': round(total_contributions, 2),
                'yearlyInterest': round(yearly_interest, 2),
                'totalInterest': round(total_interest, 2),
            })

        return jsonify({
            'success': True,
            'data': {
                'finalBalance': round(balance, 2),
                'totalContributions': round(total_contributions, 2),
                'totalInterest': round(total_interest, 2),
                'breakdown': breakdown,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── Loan Payoff ──────────────────────────────────────────────────────
@app.route('/api/calculate/loan-payoff', methods=['POST'])
def loan_payoff():
    data = request.json
    try:
        amount = float(data.get('amount', 0))
        rate = float(data.get('rate', 0))
        payment = float(data.get('payment', 0))

        monthly_rate = rate / 100 / 12
        min_payment = amount * monthly_rate

        if payment <= min_payment:
            return jsonify({
                'success': False,
                'error': f'Monthly payment must be greater than ${min_payment:.2f}'
            }), 400

        schedule = []
        balance = amount
        total_interest = 0
        month = 0

        while balance > 0.01 and month < 600:
            month += 1
            interest = balance * monthly_rate
            principal_paid = min(payment - interest, balance)
            pmt = min(payment, balance + interest)
            balance -= principal_paid
            total_interest += interest
            balance = max(0, balance)
            schedule.append({
                'month': month,
                'payment': round(pmt, 2),
                'principal': round(principal_paid, 2),
                'interest': round(interest, 2),
                'balance': round(balance, 2),
            })

        return jsonify({
            'success': True,
            'data': {
                'totalMonths': month,
                'totalInterest': round(total_interest, 2),
                'totalPayments': round(total_interest + amount, 2),
                'schedule': schedule,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── Retirement Calculator ────────────────────────────────────────────
@app.route('/api/calculate/retirement', methods=['POST'])
def retirement():
    data = request.json
    try:
        current_age = int(data.get('currentAge', 0))
        retirement_age = int(data.get('retirementAge', 0))
        current_savings = float(data.get('currentSavings', 0))
        monthly_contribution = float(data.get('monthlyContribution', 0))
        expected_return = float(data.get('expectedReturn', 0))
        withdrawal_rate = float(data.get('withdrawalRate', 4))

        years = retirement_age - current_age
        if years <= 0:
            return jsonify({'success': False, 'error': 'Retirement age must be greater than current age'}), 400

        monthly_rate = expected_return / 100 / 12
        projection = []
        balance = current_savings
        total_contributions = current_savings

        for year in range(1, years + 1):
            yearly_growth = 0
            for month in range(1, 13):
                interest = balance * monthly_rate
                yearly_growth += interest
                balance += interest + monthly_contribution
            total_contributions += monthly_contribution * 12
            projection.append({
                'age': current_age + year,
                'year': year,
                'balance': round(balance, 2),
                'totalContributions': round(total_contributions, 2),
                'yearlyGrowth': round(yearly_growth, 2),
            })

        annual_withdrawal = round(balance * (withdrawal_rate / 100), 2)

        return jsonify({
            'success': True,
            'data': {
                'retirementCorpus': round(balance, 2),
                'totalContributions': round(total_contributions, 2),
                'totalGrowth': round(balance - total_contributions, 2),
                'annualWithdrawal': annual_withdrawal,
                'monthlyWithdrawal': round(annual_withdrawal / 12, 2),
                'projection': projection,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── Inflation Calculator ─────────────────────────────────────────────
@app.route('/api/calculate/inflation', methods=['POST'])
def inflation():
    data = request.json
    try:
        current_value = float(data.get('currentValue', 0))
        years = int(data.get('years', 0))
        inflation_rate = float(data.get('inflationRate', 0))

        rate = inflation_rate / 100
        breakdown = []

        for year in range(1, years + 1):
            future_value = current_value * ((1 + rate) ** year)
            purchasing_power = current_value / ((1 + rate) ** year)
            breakdown.append({
                'year': year,
                'futureValue': round(future_value, 2),
                'purchasingPower': round(purchasing_power, 2),
                'valueEroded': round(current_value - purchasing_power, 2),
                'cumulativeInflation': round(((1 + rate) ** year - 1) * 100, 2),
            })

        final_future = current_value * ((1 + rate) ** years)
        final_pp = current_value / ((1 + rate) ** years)

        return jsonify({
            'success': True,
            'data': {
                'currentValue': current_value,
                'futureValue': round(final_future, 2),
                'purchasingPower': round(final_pp, 2),
                'valueEroded': round(current_value - final_pp, 2),
                'totalInflation': round(((1 + rate) ** years - 1) * 100, 2),
                'yearlyData': breakdown,
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── SIP Calculator ──────────────────────────────────────────────────
@app.route('/api/calculate/sip', methods=['POST'])
def sip_calculate():
    data = request.json
    try:
        monthly = float(data.get('monthlyInvestment', 0))
        rate = float(data.get('annualRate', 0))
        years = int(data.get('years', 0))
        
        monthly_rate = rate / 100 / 12
        months = years * 12
        # Future value of an annuity due
        maturity = monthly * (((pow(1 + monthly_rate, months) - 1) / monthly_rate) * (1 + monthly_rate))
        invested = monthly * months
        
        return jsonify({
            'success': True,
            'data': {
                'totalInvested': round(invested),
                'estReturns': round(maturity - invested),
                'totalValue': round(maturity)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── EMI Calculator ──────────────────────────────────────────────────
@app.route('/api/calculate/emi', methods=['POST'])
def emi_calculate():
    data = request.json
    try:
        principal = float(data.get('principal', 0))
        rate = float(data.get('rate', 0))
        years = int(data.get('years', 0))
        
        r = rate / 12 / 100
        n = years * 12
        emi = (principal * r * pow(1 + r, n)) / (pow(1 + r, n) - 1)
        total = emi * n
        
        return jsonify({
            'success': True,
            'data': {
                'emi': round(emi),
                'totalInterest': round(total - principal),
                'totalPayment': round(total)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── India Tax Calculator ─────────────────────────────────────────────
@app.route('/api/calculate/india-tax', methods=['POST'])
def india_tax():
    data = request.json
    try:
        income = float(data.get('annualIncome', 0))
        standard_deduction = 75000
        taxable = max(0, income - standard_deduction)
        tax = 0
        
        # New Regime 2024-25 Slabs
        if taxable <= 300000: tax = 0
        elif taxable <= 700000: tax = (taxable - 300000) * 0.05
        elif taxable <= 1000000: tax = (400000 * 0.05) + (taxable - 700000) * 0.10
        elif taxable <= 1200000: tax = (400000 * 0.05) + (300000 * 0.10) + (taxable - 1000000) * 0.15
        elif taxable <= 1500000: tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (taxable - 1200000) * 0.20
        else: tax = (400000 * 0.05) + (300000 * 0.10) + (200000 * 0.15) + (300000 * 0.20) + (taxable - 1500000) * 0.30

        # Section 87A rebate for income up to 7L
        if taxable <= 700000: tax = 0
        
        cess = tax * 0.04
        total_tax = tax + cess
        
        return jsonify({
            'success': True,
            'data': {
                'taxableIncome': round(taxable),
                'totalTax': round(total_tax),
                'takeHome': round(income - total_tax),
                'effectiveRate': round((total_tax / income) * 100, 2) if income > 0 else 0
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


@app.route('/api/gst', methods=['POST'])
def api_gst():
    try:
        data = request.json
        amount = float(data.get('amount', 0))
        rate = float(data.get('rate', 0))
        inclusive = bool(data.get('inclusive', False))
        
        if inclusive:
            net_amount = amount / (1 + rate / 100)
            gst_amount = amount - net_amount
            total_amount = amount
        else:
            gst_amount = amount * (rate / 100)
            net_amount = amount
            total_amount = amount + gst_amount
            
        return jsonify({
            'success': True,
            'data': {
                'netAmount': round(net_amount, 2),
                'gstAmount': round(gst_amount, 2),
                'totalAmount': round(total_amount, 2),
                'cgst': round(gst_amount / 2, 2),
                'sgst': round(gst_amount / 2, 2)
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400


# ─── Serve React Frontend (FINAL FIX) ─────────────────────────────────
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    full_path = os.path.join(FRONTEND_FOLDER, path)

    # Serve static files (JS, CSS, images)
    if path and os.path.isfile(full_path):
        return send_from_directory(FRONTEND_FOLDER, path)

    # Serve React app
    return send_from_directory(FRONTEND_FOLDER, "index.html")


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
