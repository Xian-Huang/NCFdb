// 自定义 Admin 脚本

document.addEventListener('DOMContentLoaded', function() {
    // 添加平滑滚动
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // 表格行点击效果
    document.querySelectorAll('tbody tr').forEach(row => {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            if (!e.target.closest('input, a, button')) {
                const link = this.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
            }
        });
    });

    // 搜索框聚焦效果
    const searchInput = document.querySelector('#search-bar');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('shadow-lg');
            this.style.borderColor = '#f59e0b';
        });
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('shadow-lg');
            this.style.borderColor = '#d1d5db';
        });
    }

    // 按钮加载动画
    document.querySelectorAll('button[type="submit"]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                const originalText = this.innerHTML;
                this.innerHTML = '<span class="spinner-border spinner-border-sm mr-2"></span> Loading...';
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.innerHTML = originalText;
                }, 2000);
            }
        });
    });

    // 自动隐藏消息
    const messages = document.querySelector('.messages');
    if (messages) {
        setTimeout(() => {
            messages.style.opacity = '0';
            setTimeout(() => messages.remove(), 500);
        }, 5000);
    }

    // 侧边栏折叠动画
    const sidebarToggle = document.querySelector('[data-toggle="sidebar"]');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }

    // 表格排序指示器
    document.querySelectorAll('th.sortable a').forEach(th => {
        th.addEventListener('click', function() {
            document.querySelectorAll('th.sortable a').forEach(a => a.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 表单验证增强
    const forms = document.querySelectorAll('.validate-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields');
            }
        });
    });

    console.log('NCFdb Admin Custom Scripts Loaded');
});
