document.addEventListener('DOMContentLoaded', () => {
    const firstNum = document.getElementById('firstNum');
    const secondNum = document.getElementById('secondNum');
    const operator = document.getElementById('operator');
    const calcButton = document.getElementById('calcButton');
    const oldOut = document.querySelector('.oldResult');
    const newOut = document.querySelector('.newResult');
    const warnMsg = document.getElementById('warnMsg');

    if (!firstNum || !secondNum || !operator || !calcButton || !oldOut || !newOut || !warnMsg) {
        console.error('Не удалось найти необходимые элементы');
        return;
    }

    let previousOp = '';

    function normalizeInput(e) {
        const input = e.target;
        let value = input.value;
        value = value.replace(/[^0-9.-]/g, '');

        const minusCount = (value.match(/-/g) || []).length;
        if (minusCount > 1) {
            value = value.replace(/-/g, '');
            if (value.length > 0 && value[0] !== '-') {
                value = '-' + value;
            }
        } else if (minusCount === 1 && value[0] !== '-') {
            value = value.replace(/-/g, '');
        }

        const dotCount = (value.match(/\./g) || []).length;
        if (dotCount > 1) {
            const parts = value.split('.');
            value = parts[0] + '.' + parts.slice(1).join('').replace(/\./g, '');
        }

        if (!(value === '' || value === '-' || value === '.' || value === '-.')) {
            let num = parseFloat(value);
            if (!isNaN(num)) {
                if (num === 0 && value.startsWith('-')) {
                    value = '-0';
                } else {
                    value = num.toString();
                }
            }
        }

        if (input.value !== value) {
            input.value = value;
        }
    }

    firstNum.addEventListener('input', normalizeInput);
    secondNum.addEventListener('input', normalizeInput);

    function showError(message, field) {
        document.querySelectorAll('.numberInput, .operatorSelect').forEach(el => {
            el.classList.remove('error');
        });

        if (field) {
            field.classList.add('error');
            const rect = field.getBoundingClientRect();
            warnMsg.style.top = rect.bottom + window.scrollY + 5 + 'px';
            warnMsg.style.left = rect.left + window.scrollX + 'px';
            warnMsg.style.right = 'auto';
            warnMsg.textContent = message;
            warnMsg.style.display = 'block';
        } else {
            warnMsg.style.top = '20px';
            warnMsg.style.right = '20px';
            warnMsg.style.left = 'auto';
            warnMsg.textContent = message;
            warnMsg.style.display = 'block';
        }

        setTimeout(() => {
            warnMsg.style.display = 'none';
        }, 3000);
    }

    function validate() {
        const val1 = firstNum.value.trim();
        const val2 = secondNum.value.trim();
        const op = operator.value;

        if (val1 === '') {
            showError('Введите первое число', firstNum);
            return null;
        }
        if (val2 === '') {
            showError('Введите второе число', secondNum);
            return null;
        }

        const num1 = parseFloat(val1);
        const num2 = parseFloat(val2);

        if (op === 'divide' && num2 === 0) {
            showError('На ноль делить нельзя', secondNum);
            return null;
        }

        document.querySelectorAll('.numberInput, .operatorSelect').forEach(el => {
            el.classList.remove('error');
        });
        warnMsg.style.display = 'none';

        return { num1, num2 };
    }

    function compute(n1, n2, op) {
        switch (op) {
            case 'add': return n1 + n2;
            case 'subtract': return n1 - n2;
            case 'multiply': return n1 * n2;
            case 'divide': return n1 / n2;
            default: return NaN;
        }
    }

    calcButton.addEventListener('click', () => {
        const validated = validate();
        if (!validated) return;

        const { num1, num2 } = validated;
        const op = operator.value;
        const result = compute(num1, num2, op);

        if (!isNaN(result)) {
            const rounded = Math.round(result * 1e10) / 1e10;
            const symbol = {
                'add': '+',
                'subtract': '-',
                'multiply': '*',
                'divide': '/'
            }[op];

            const isMobile = window.innerWidth <= 600;
            let currentStr;

            if (isMobile) {
                currentStr = `${num1}<br>${symbol}<br>${num2}<br>= ${rounded}`;
            } else {
                currentStr = `${num1} ${symbol} ${num2} = ${rounded}`;
            }

            oldOut.innerHTML = previousOp || '';
            newOut.innerHTML = currentStr;
            previousOp = currentStr;
        } else {
            showError('Ошибка вычисления');
        }
    });

    oldOut.innerHTML = '';
    newOut.innerHTML = '';
});