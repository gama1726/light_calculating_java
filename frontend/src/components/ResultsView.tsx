import { useState } from 'react';
import type { CalculationResult } from '../types';

interface ResultsViewProps {
  result: CalculationResult;
}

export default function ResultsView({ result }: ResultsViewProps) {
  const [activeTab, setActiveTab] = useState('lighting');

  const tabs = [
    { id: 'lighting', label: 'Освещение' },
    { id: 'sockets', label: 'Розетки' },
    { id: 'ep', label: 'ЭП' },
    { id: 'transformer', label: 'Трансформатор' },
    { id: 'conductors', label: 'Проводники' },
    { id: 'breakers', label: 'Автоматы' },
    { id: 'shortcircuit', label: 'КЗ' },
    { id: 'grounding', label: 'Заземление' },
  ];

  const formatNumber = (num: number, decimals: number = 2) => {
    if (num === null || num === undefined || isNaN(num)) {
      return '0.00';
    }
    return num.toFixed(decimals);
  };

  // Проверка данных
  if (!result) {
    return <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">Нет данных для отображения</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <div className="border-b border-gray-200">
        <nav className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'lighting' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Расчёт освещения</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Расчётная высота h</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.h)} м</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Индекс помещения i</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.i)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Площадь S</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.S)} м²</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Коэффициент использования η</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.eta, 3)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Коэффициент z</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.z, 2)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Число светильников N</p>
                <p className="text-lg font-semibold">{result.lighting.N} шт</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Суммарный световой поток Φ_Σ</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.Phi_total, 0)} лм</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Световой поток одной лампы Φ_л</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.Phi_lamp, 0)} лм</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Мощность одной лампы P_л</p>
                <p className="text-lg font-semibold">{formatNumber(result.lighting.P_lamp, 0)} Вт</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Марка светильника</p>
                <p className="text-lg font-semibold">{result.lighting.lamp_model}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Мощности и ток</h4>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Параметр</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Значение</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Ед. изм.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Активная мощность P</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.lighting.P_r_osv)}</td>
                    <td className="border border-gray-300 px-4 py-2">кВт</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Реактивная мощность Q</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.lighting.Q_r_osv)}</td>
                    <td className="border border-gray-300 px-4 py-2">кВАр</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Полная мощность S</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.lighting.S_r_osv)}</td>
                    <td className="border border-gray-300 px-4 py-2">кВА</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Ток I</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.lighting.I_r_osv)}</td>
                    <td className="border border-gray-300 px-4 py-2">А</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-yellow-50 p-4 rounded">
              <p className="text-sm"><strong>Аварийное освещение:</strong> {result.lighting.n_a} светильников</p>
            </div>
          </div>
        )}

        {activeTab === 'sockets' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Расчёт розеточной сети</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Параметр</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Значение</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ед. изм.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Активная мощность P</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.sockets.P_r_sockets)}</td>
                  <td className="border border-gray-300 px-4 py-2">кВт</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Реактивная мощность Q</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.sockets.Q_r_sockets)}</td>
                  <td className="border border-gray-300 px-4 py-2">кВАр</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Полная мощность S</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.sockets.S_r_sockets)}</td>
                  <td className="border border-gray-300 px-4 py-2">кВА</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Ток I</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.sockets.I_r_sockets)}</td>
                  <td className="border border-gray-300 px-4 py-2">А</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Коэффициент спроса Ks</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.sockets.Ks, 3)}</td>
                  <td className="border border-gray-300 px-4 py-2">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'ep' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Расчёт электроприёмников</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2">№</th>
                  <th className="border border-gray-300 px-4 py-2">P_nom, кВт</th>
                  <th className="border border-gray-300 px-4 py-2">P_r, кВт</th>
                  <th className="border border-gray-300 px-4 py-2">Q_r, кВАр</th>
                  <th className="border border-gray-300 px-4 py-2">S, кВА</th>
                  <th className="border border-gray-300 px-4 py-2">I, А</th>
                  <th className="border border-gray-300 px-4 py-2">cos φ</th>
                </tr>
              </thead>
              <tbody>
                {result.ep_group.EP_list.map((ep) => (
                  <tr key={ep.number}>
                    <td className="border border-gray-300 px-4 py-2 text-center">{ep.number}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.P_nom)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.P_r)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.Q_r)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.S)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.I)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(ep.cos_phi, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="bg-gray-50 p-4 rounded">
              <p><strong>Суммарная активная мощность:</strong> {formatNumber(result.ep_group.P_sum)} кВт</p>
              <p><strong>Суммарная реактивная мощность:</strong> {formatNumber(result.ep_group.Q_sum)} кВАр</p>
              <p><strong>Полная мощность (с K_рм={result.ep_group.Krm}):</strong> {formatNumber(result.ep_group.S_p)} кВА</p>
              <p><strong>Ток группы:</strong> {formatNumber(result.ep_group.I_p)} А</p>
            </div>
          </div>
        )}

        {activeTab === 'transformer' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Выбор трансформатора</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Суммарная мощность S_Σ</p>
                <p className="text-lg font-semibold">{formatNumber(result.transformer.S_total)} кВА</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Число трансформаторов</p>
                <p className="text-lg font-semibold">{result.transformer.n_tr} шт</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Требуемая мощность</p>
                <p className="text-lg font-semibold">{formatNumber(result.transformer.S_nom_req)} кВА</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-600">Выбранный трансформатор</p>
                <p className="text-lg font-semibold">{result.transformer.transformer_model}</p>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded">
              <p><strong>Номинальная мощность:</strong> {formatNumber(result.transformer.S_nom)} кВА</p>
              <p><strong>R_tr:</strong> {formatNumber(result.transformer.R_tr, 4)} Ом</p>
              <p><strong>X_tr:</strong> {formatNumber(result.transformer.X_tr, 4)} Ом</p>
            </div>
          </div>
        )}

        {activeTab === 'conductors' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Выбор проводников</h3>
            {result.conductors && result.conductors.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Участок</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">I_r, А</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">Сечение, мм²</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Марка</th>
                    <th className="border border-gray-300 px-4 py-2 text-right">I_доп, А</th>
                    {result.conductors.some(c => c.Delta_U !== undefined) && (
                      <th className="border border-gray-300 px-4 py-2 text-right">ΔU, %</th>
                    )}
                    {result.conductors.some(c => c.length !== undefined) && (
                      <th className="border border-gray-300 px-4 py-2 text-right">Длина, км</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {result.conductors.map((cond, idx) => (
                    <tr key={idx}>
                      <td className="border border-gray-300 px-4 py-2">{cond.name || 'Не указано'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(cond.I_r || 0)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(cond.section || 0)}</td>
                      <td className="border border-gray-300 px-4 py-2">{cond.cable_type || 'Не указано'}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(cond.I_dop || 0)}</td>
                      {result.conductors.some(c => c.Delta_U !== undefined) && (
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {cond.Delta_U !== undefined ? formatNumber(cond.Delta_U, 2) : '-'}
                        </td>
                      )}
                      {result.conductors.some(c => c.length !== undefined) && (
                        <td className="border border-gray-300 px-4 py-2 text-right">
                          {cond.length !== undefined ? formatNumber(cond.length, 3) : '-'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
                <p className="text-yellow-800">Нет данных о проводниках. Проверьте расчёт.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'breakers' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Выбор автоматических выключателей</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Участок</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">I_r, А</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">I_ном, А</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Полюсов</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Тип</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">I_откл, кА</th>
                </tr>
              </thead>
              <tbody>
                {result.breakers.map((breaker, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-4 py-2">{breaker.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(breaker.I_r)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(breaker.I_nom_breaker)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{breaker.poles}</td>
                    <td className="border border-gray-300 px-4 py-2">{breaker.breaker_type}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(breaker.breaking_capacity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'shortcircuit' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Расчёт короткого замыкания</h3>
            {result.short_circuit.map((sc, idx) => (
              <div key={idx} className="mb-6">
                <h4 className="font-semibold mb-3">Точка: {sc.point}</h4>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Параметр</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Значение</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Ед. изм.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">R_Σ</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.R_sum, 4)}</td>
                      <td className="border border-gray-300 px-4 py-2">Ом</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">X_Σ</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.X_sum, 4)}</td>
                      <td className="border border-gray-300 px-4 py-2">Ом</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Z_экв</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.Z_eq, 4)}</td>
                      <td className="border border-gray-300 px-4 py-2">Ом</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">I_k(3)</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.I_k3, 2)}</td>
                      <td className="border border-gray-300 px-4 py-2">кА</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">I_уд</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.I_shock, 2)}</td>
                      <td className="border border-gray-300 px-4 py-2">кА</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">S_min</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(sc.S_min, 2)}</td>
                      <td className="border border-gray-300 px-4 py-2">мм²</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'grounding' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Расчёт заземления</h3>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Параметр</th>
                  <th className="border border-gray-300 px-4 py-2 text-right">Значение</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Ед. изм.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Ток замыкания на землю I_З</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.I_g, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">А</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Допустимое сопротивление R_З</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.R_allowed, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">Ом</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Сопротивление фундамента R_Ф</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.R_f, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">Ом</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Требуемое R_иск</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.R_isk, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">Ом</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Сопротивление одного электрода R_В</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.R_v, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">Ом</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Число электродов N_В</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{result.grounding.N_v}</td>
                  <td className="border border-gray-300 px-4 py-2">шт</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Итоговое сопротивление R_итог</td>
                  <td className="border border-gray-300 px-4 py-2 text-right">{formatNumber(result.grounding.R_total, 2)}</td>
                  <td className="border border-gray-300 px-4 py-2">Ом</td>
                </tr>
              </tbody>
            </table>
            <div className={`p-4 rounded ${result.grounding.is_valid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              <p className="font-semibold">
                {result.grounding.is_valid
                  ? '✓ Заземление соответствует требованиям ПУЭ'
                  : '✗ Заземление не соответствует требованиям ПУЭ'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


