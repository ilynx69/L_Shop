import React, { useState } from 'react';

// Описываем тип для данных формы, чтобы не использовать any [cite: 94, 128]
interface DeliveryData {
  address: string;
  phone: string;
  email: string;
  paymentMethod: string;
}

export const DeliveryPage: React.FC = () => {
  const [formData, setFormData] = useState<DeliveryData>({
    address: '',
    phone: '',
    email: '',
    paymentMethod: 'card'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Оформление доставки:', formData);
    alert('Заказ оформлен!');
  };

  return (
    <div>
      <h1>Оформление доставки</h1>
      {/* data-delivery на форме — обязательное требование [cite: 122] */}
      <form data-delivery="order-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Адрес доставки"
          value={formData.address}
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          required
        />
        <input
          type="tel"
          placeholder="Телефон"
          value={formData.phone}
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        
        <select 
          value={formData.paymentMethod}
          onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
        >
          <option value="card">Карта</option>
          <option value="cash">Наличные</option>
        </select>

        <button type="submit">Подтвердить заказ</button>
      </form>
    </div>
  );
};