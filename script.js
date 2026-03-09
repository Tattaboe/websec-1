let a = document.getElementById('firstNum');
let b = document.getElementById('secondNum');
let op = document.getElementById('operator');
let btn = document.getElementById('calcButton');
let oldDiv = document.querySelector('.oldResult');
let newDiv = document.querySelector('.newResult');
let errDiv = document.getElementById('warnMsg');

let prev = '';

function showErr(msg, field) {
    a.classList.remove('error');
    b.classList.remove('error');
    
    field.classList.add('error');
    
    let rect = field.getBoundingClientRect();
    errDiv.style.top = (rect.bottom + window.scrollY + 5) + 'px';
    errDiv.style.left = (rect.left + window.scrollX) + 'px';
    errDiv.textContent = msg;
    errDiv.style.display = 'block';
    
    setTimeout(function() {
        errDiv.style.display = 'none';
    }, 3000);
}

function clearErr() {
    a.classList.remove('error');
    b.classList.remove('error');
    errDiv.style.display = 'none';
}

function getNums() {
    let v1 = a.value.trim();
    let v2 = b.value.trim();
    
    if (v1 === '') {
        showErr('Введите первое число', a);
        return null;
    }
    if (v2 === '') {
        showErr('Введите второе число', b);
        return null;
    }
    
    let n1 = parseFloat(v1);
    let n2 = parseFloat(v2);
    
    if (isNaN(n1)) {
        showErr('Первое число должно быть числом', a);
        return null;
    }
    if (isNaN(n2)) {
        showErr('Второе число должно быть числом', b);
        return null;
    }
    
    return { n1: n1, n2: n2 };
}

function calc(n1, n2, oper) {
    if (oper === 'add') {
        return n1 + n2;
    } else if (oper === 'subtract') {
        return n1 - n2;
    } else if (oper === 'multiply') {
        return n1 * n2;
    } else if (oper === 'divide') {
        return n1 / n2;
    } else {
        return NaN;
    }
}

btn.addEventListener('click', function() {
    clearErr();
    
    let nums = getNums();
    if (nums === null) {
        return;
    }
    
    let n1 = nums.n1;
    let n2 = nums.n2;
    let oper = op.value;
    
    if (oper === 'divide' && n2 === 0) {
        showErr('На ноль делить нельзя', b);
        return;
    }
    
    let res = calc(n1, n2, oper);
    
    if (isNaN(res)) {
        showErr('Ошибка при вычислении', a);
        return;
    }
    
    let rounded = Math.round(res * 10000000000) / 10000000000;
    
    let sym;
    if (oper === 'add') {
        sym = '+';
    } else if (oper === 'subtract') {
        sym = '-';
    } else if (oper === 'multiply') {
        sym = '*';
    } else if (oper === 'divide') {
        sym = '/';
    }
    
    let mobile = window.innerWidth <= 600;
    
    let curStr;
    if (mobile) {
        curStr = n1 + '<br>' + sym + '<br>' + n2 + '<br>= ' + rounded;
    } else {
        curStr = n1 + ' ' + sym + ' ' + n2 + ' = ' + rounded;
    }
    
    oldDiv.innerHTML = prev;
    newDiv.innerHTML = curStr;
    
    prev = curStr;
});

a.addEventListener('input', function() {
    a.classList.remove('error');
    if (!a.classList.contains('error') && !b.classList.contains('error')) {
        errDiv.style.display = 'none';
    }
});

b.addEventListener('input', function() {
    b.classList.remove('error');
    if (!a.classList.contains('error') && !b.classList.contains('error')) {
        errDiv.style.display = 'none';
    }
});

a.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        btn.click();
    }
});

b.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        btn.click();
    }
});