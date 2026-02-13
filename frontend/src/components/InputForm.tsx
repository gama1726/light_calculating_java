import { useState } from 'react';
import type { InputData } from '../types';

interface InputFormProps {
  onSubmit: (data: InputData) => void;
  loading: boolean;
}

export default function InputForm({ onSubmit, loading }: InputFormProps) {
  const [formData, setFormData] = useState<InputData>({
    A: 30,
    B: 20,
    H: 6,
    h_p: 0.8,
    h_c: 0.5,
    E_n: 300,
    lamp_type: 'LED',
    n_sockets: 10,
    P_nom_list: [5, 7.5, 10],
    cos_phi_list: [0.9, 0.85, 0.9],
    category: 2,
    U_HV: 10,
    L_KL: 0.5,
    S_fundament: 100,
  });


  const handleChange = (field: keyof InputData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEpChange = (index: number, field: 'P_nom' | 'cos_phi', value: number) => {
    const newList = [...formData.P_nom_list];
    const newCosList = [...formData.cos_phi_list];
    
    if (field === 'P_nom') {
      newList[index] = value;
      setFormData(prev => ({ ...prev, P_nom_list: newList }));
    } else {
      newCosList[index] = value;
      setFormData(prev => ({ ...prev, cos_phi_list: newCosList }));
    }
  };

  const handleAddEp = () => {
    setFormData(prev => ({
      ...prev,
      P_nom_list: [...prev.P_nom_list, 5],
      cos_phi_list: [...prev.cos_phi_list, 0.9],
    }));
  };

  const handleRemoveEp = (index: number) => {
    setFormData(prev => ({
      ...prev,
      P_nom_list: prev.P_nom_list.filter((_, i) => i !== index),
      cos_phi_list: prev.cos_phi_list.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Входные данные</h2>

      {/* Геометрия цеха */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Геометрия цеха</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длина цеха A, м
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.A}
              onChange={(e) => handleChange('A', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ширина цеха B, м
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.B}
              onChange={(e) => handleChange('B', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Высота цеха H, м
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.H}
              onChange={(e) => handleChange('H', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Высота над полом h_p, м
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.h_p}
              onChange={(e) => handleChange('h_p', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Свес светильника h_c, м
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.h_c}
              onChange={(e) => handleChange('h_c', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </section>

      {/* Освещение */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Освещение</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Нормируемая освещённость E_n, лк
            </label>
            <input
              type="number"
              step="10"
              value={formData.E_n}
              onChange={(e) => handleChange('E_n', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип лампы
            </label>
            <select
              value={formData.lamp_type}
              onChange={(e) => handleChange('lamp_type', e.target.value as 'LED' | 'LL')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LED">LED</option>
              <option value="LL">Люминесцентные (ЛЛ)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Розетки */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Розеточная сеть</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Число розеток
          </label>
          <input
            type="number"
            value={formData.n_sockets}
            onChange={(e) => handleChange('n_sockets', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            min="1"
          />
        </div>
      </section>

      {/* Электроприёмники */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-gray-700">Электроприёмники</h3>
          <button
            type="button"
            onClick={handleAddEp}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            + Добавить
          </button>
        </div>
        <div className="space-y-2">
          {formData.P_nom_list.map((p, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">
                  ЭП {idx + 1}: P_nom, кВт
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={p}
                  onChange={(e) => handleEpChange(idx, 'P_nom', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-600 mb-1">
                  cos φ
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="1"
                  value={formData.cos_phi_list[idx]}
                  onChange={(e) => handleEpChange(idx, 'cos_phi', parseFloat(e.target.value))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  required
                />
              </div>
              {formData.P_nom_list.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEp(idx)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Электроснабжение */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Электроснабжение</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Категория электроснабжения
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Напряжение ВН U_HV, кВ
            </label>
            <select
              value={formData.U_HV}
              onChange={(e) => handleChange('U_HV', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="6">6</option>
              <option value="10">10</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Длина кабельной линии L_KL, км
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.L_KL}
              onChange={(e) => handleChange('L_KL', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
      </section>

      {/* Заземление */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Заземление</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Площадь фундамента S_fundament, м²
          </label>
          <input
            type="number"
            step="1"
            value={formData.S_fundament}
            onChange={(e) => handleChange('S_fundament', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </section>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Расчёт...' : 'Рассчитать'}
      </button>
    </form>
  );
}






