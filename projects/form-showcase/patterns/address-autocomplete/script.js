// 住所自動入力機能
class AddressAutocomplete {
    constructor() {
        this.postalCodeInput = document.getElementById('postalCode');
        this.digitalAddressInput = document.getElementById('digitalAddress');
        this.searchPostalBtn = document.getElementById('searchPostal');
        this.searchDigitalBtn = document.getElementById('searchDigital');
        this.addressResult = document.getElementById('addressResult');
        
        this.prefectureSelect = document.getElementById('prefecture');
        this.cityInput = document.getElementById('city');
        this.addressInput = document.getElementById('address');
        
        this.init();
    }
    
    init() {
        // 郵便番号検索ボタン
        this.searchPostalBtn.addEventListener('click', () => {
            this.searchPostalCode(this.postalCodeInput.value);
        });
        
        // デジタルアドレス検索ボタン
        this.searchDigitalBtn.addEventListener('click', () => {
            this.searchDigitalAddress(this.digitalAddressInput.value);
        });
        
        // 郵便番号フィールドでのエンターキー検索
        this.postalCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchPostalCode(this.postalCodeInput.value);
            }
        });
        
        // デジタルアドレスフィールドでのエンターキー検索
        this.digitalAddressInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchDigitalAddress(this.digitalAddressInput.value);
            }
        });
        
        // 郵便番号の入力フォーマット（数字のみ）
        this.postalCodeInput.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // 全角を半角に変換
            value = value.replace(/[０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            
            // ハイフン、スペース、その他の記号を除去
            value = value.replace(/[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ\s　]/g, '');
            
            // 数字以外を除去
            value = value.replace(/[^0-9]/g, '');
            
            e.target.value = value;
        });
        
        // デジタルアドレスの入力フォーマット（英数字のみ）
        this.digitalAddressInput.addEventListener('input', (e) => {
            let value = e.target.value;
            
            // 全角を半角に変換
            value = value.replace(/[０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            value = value.replace(/[Ａ-Ｚａ-ｚ]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            
            // ハイフン、スペース、その他の記号を除去
            value = value.replace(/[-－﹣−‐⁃‑‒–—﹘―⎯⏤ーｰ\s　]/g, '');
            
            // 英数字以外を除去し、大文字に変換
            value = value.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
            
            e.target.value = value;
        });
        
        // カナ入力の自動変換（ひらがな→カタカナ）- フォーカスアウト時
        const kanaInputs = document.querySelectorAll('#lastNameKana, #firstNameKana');
        kanaInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                let value = e.target.value;
                // ひらがなをカタカナに変換
                value = value.replace(/[\u3041-\u3096]/g, (match) => {
                    const charCode = match.charCodeAt(0) + 0x60;
                    return String.fromCharCode(charCode);
                });
                e.target.value = value;
            });
        });
        
        // メールアドレスの自動変換 - フォーカスアウト時
        const emailInput = document.getElementById('email');
        emailInput.addEventListener('blur', (e) => {
            let value = e.target.value;
            // 全角を半角に変換
            value = value.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            // 全角記号を半角に変換
            value = value.replace(/＠/g, '@');
            value = value.replace(/．/g, '.');
            value = value.replace(/＿/g, '_');
            value = value.replace(/－/g, '-');
            // 小文字に変換
            value = value.toLowerCase();
            e.target.value = value;
        });
        
        // 電話番号の自動変換 - フォーカスアウト時
        const phoneInput = document.getElementById('phone');
        phoneInput.addEventListener('blur', (e) => {
            let value = e.target.value;
            // 全角を半角に変換
            value = value.replace(/[０-９]/g, (s) => {
                return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
            });
            // ハイフン、スペース、括弧など全て除去（数字のみに）
            value = value.replace(/[^0-9]/g, '');
            e.target.value = value;
        });
    }
    
    async searchPostalCode(code) {
        if (!code || code.length !== 7) {
            this.showError('7桁の郵便番号を入力してください');
            return;
        }
        
        // ローディング状態
        this.setLoadingState(this.searchPostalBtn, true);
        
        try {
            const response = await fetch(`https://digital-address.app/${code}`);
            
            if (!response.ok) {
                throw new Error('住所が見つかりませんでした');
            }
            
            const data = await response.json();
            
            if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0];
                this.fillAddress(address);
                this.showSuccess();
            } else {
                throw new Error('住所が見つかりませんでした');
            }
        } catch (error) {
            this.showError(error.message || '検索中にエラーが発生しました');
        } finally {
            this.setLoadingState(this.searchPostalBtn, false);
        }
    }
    
    async searchDigitalAddress(code) {
        if (!code || code.length !== 7) {
            this.showError('7桁のデジタルアドレスを入力してください');
            return;
        }
        
        // ローディング状態
        this.setLoadingState(this.searchDigitalBtn, true);
        
        try {
            const response = await fetch(`https://digital-address.app/${code}`);
            
            if (!response.ok) {
                throw new Error('住所が見つかりませんでした');
            }
            
            const data = await response.json();
            
            if (data.addresses && data.addresses.length > 0) {
                const address = data.addresses[0];
                this.fillAddress(address);
                
                // デジタルアドレス検索の場合は郵便番号も埋める
                if (address.zip_code) {
                    this.postalCodeInput.value = address.zip_code;
                }
                
                this.showSuccess();
            } else {
                throw new Error('住所が見つかりませんでした');
            }
        } catch (error) {
            this.showError(error.message || '検索中にエラーが発生しました');
        } finally {
            this.setLoadingState(this.searchDigitalBtn, false);
        }
    }
    
    fillAddress(addressData) {
        // 都道府県
        if (addressData.pref_name) {
            this.prefectureSelect.value = addressData.pref_name;
        }
        
        // 市区町村
        if (addressData.city_name) {
            this.cityInput.value = addressData.city_name;
        }
        
        // 町名・番地
        if (addressData.block_name) {
            // デジタルアドレスの場合、block_nameに番地まで含まれる
            this.addressInput.value = addressData.town_name + addressData.block_name;
        } else if (addressData.town_name) {
            // 郵便番号の場合、町名のみ
            this.addressInput.value = addressData.town_name;
        }
        
        // フィールドをハイライトして成功を表示
        [this.prefectureSelect, this.cityInput, this.addressInput].forEach(field => {
            // 成功スタイルを適用
            field.style.cssText = `
                background-color: rgba(16, 185, 129, 0.08);
                transition: background-color 0.3s ease;
            `;
            
            // 3秒後に元に戻す
            setTimeout(() => {
                field.style.cssText = '';
            }, 3000);
        });
        
        // 次のフィールドにフォーカス（建物名）
        const buildingInput = document.getElementById('building');
        if (buildingInput) {
            setTimeout(() => {
                buildingInput.focus();
            }, 100);
        }
    }
    
    showSuccess() {
        this.addressResult.style.display = 'block';
        setTimeout(() => {
            this.addressResult.style.display = 'none';
        }, 3000);
    }
    
    showError(message) {
        // 簡易的なエラー表示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--error-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            animation: slideIn 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(errorDiv);
            }, 300);
        }, 3000);
    }
    
    setLoadingState(button, isLoading) {
        button.disabled = isLoading;
        
        if (isLoading) {
            button.classList.add('loading');
            // ボタンのテキストとアイコンを保存
            button.dataset.originalHtml = button.innerHTML;
            // ローディングスピナーに変更
            button.innerHTML = `
                <svg class="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                    <path d="M12 2C6.48 2 2 6.48 2 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                検索中...
            `;
        } else {
            button.classList.remove('loading');
            // 元のテキストとアイコンに戻す
            if (button.dataset.originalHtml) {
                button.innerHTML = button.dataset.originalHtml;
            }
        }
    }
}

// フォームバリデーション
class FormValidator {
    constructor() {
        this.form = document.getElementById('checkoutForm');
        if (!this.form) {
            return;
        }
        this.init();
    }
    
    init() {
        let allFieldsValidated = false;
        
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            allFieldsValidated = true; // 初回submit後はリアルタイムバリデーション開始
            
            if (this.validateForm()) {
                // 成功メッセージ
                this.showSuccessMessage();
            }
        });
        
        // リアルタイムバリデーション（賢い方式）
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        inputs.forEach(input => {
            // 初回はsubmitまで待つ、2回目以降はリアルタイム
            input.addEventListener('blur', () => {
                if (allFieldsValidated) {
                    this.validateField(input);
                }
            });
            
            // 入力時にも（一度バリデーションされていれば）チェック
            input.addEventListener('input', () => {
                if (allFieldsValidated) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
            this.showFieldError(formGroup, '必須項目です');
            return false;
        }
        
        // メールアドレスの検証
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(formGroup, '有効なメールアドレスを入力してください');
                return false;
            }
        }
        
        // 電話番号の検証（phoneフィールドのみ）
        if (field.id === 'phone') {
            const phoneRegex = /^[0-9]+$/;
            if (!phoneRegex.test(field.value)) {
                this.showFieldError(formGroup, '有効な電話番号を入力してください');
                return false;
            }
            // 電話番号の桁数チェック（10桁または11桁）
            if (field.value.length < 10 || field.value.length > 11) {
                this.showFieldError(formGroup, '電話番号は10桁または11桁で入力してください');
                return false;
            }
        }
        
        // 郵便番号の検証
        if (field.id === 'postalCode') {
            const postalRegex = /^[0-9]{7}$/;
            if (!postalRegex.test(field.value)) {
                this.showFieldError(formGroup, '7桁の郵便番号を入力してください');
                return false;
            }
        }
        
        this.clearFieldError(formGroup);
        return true;
    }
    
    showFieldError(formGroup, message) {
        formGroup.classList.remove('success');
        formGroup.classList.add('error');
        let errorMessage = formGroup.querySelector('.error-message');
        
        if (!errorMessage) {
            errorMessage = document.createElement('small');
            errorMessage.className = 'error-message';
            formGroup.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
    }
    
    clearFieldError(formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.add('success');
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }
    
    showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 3rem;
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            text-align: center;
            z-index: 1000;
        `;
        
        successDiv.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style="margin: 0 auto 1rem;">
                <circle cx="12" cy="12" r="10" stroke="#10b981" stroke-width="2"/>
                <path d="M8 12L11 15L16 9" stroke="#10b981" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h2 style="font-size: 1.5rem; margin-bottom: 0.5rem;">注文が完了しました！</h2>
            <p style="color: var(--text-secondary);">確認メールをお送りしました</p>
        `;
        
        document.body.appendChild(successDiv);
        
        // オーバーレイ
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999;
        `;
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            document.body.removeChild(successDiv);
            document.body.removeChild(overlay);
            this.form.reset();
        }, 3000);
    }
}

// アニメーション用CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }
        to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }
    }
    
    @keyframes fadeOutScale {
        from {
            opacity: 1;
            transform: translateY(-50%) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50%) scale(0.8);
        }
    }
    
    @keyframes spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new AddressAutocomplete();
    new FormValidator();
});