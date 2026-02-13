import { useState } from 'react';
import InputForm from './components/InputForm';
import ResultsView from './components/ResultsView';
import ErrorBoundary from './components/ErrorBoundary';
import type { InputData, CalculationResult } from './types';
import { calculate } from './api';

function App() {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async (data: InputData) => {
    setLoading(true);
    setError(null);
    try {
      const calculationResult = await calculate(data);
      setResult(calculationResult);
    } catch (err: any) {
      const detail = err.response?.data?.detail ?? err.response?.data?.message;
      const msg = typeof detail === 'string' ? detail : (Array.isArray(detail) ? detail.join(', ') : err.message);
      setError(msg || 'Ошибка при расчёте');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">
            Расчёт электроснабжения производственного цеха
          </h1>
          <p className="mt-2 text-blue-100">
            Автоматизация расчёта по методическим указаниям
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InputForm onSubmit={handleCalculate} loading={loading} />
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            {result && (
              <ErrorBoundary>
                <ResultsView result={result} />
              </ErrorBoundary>
            )}
            {!result && !loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                Введите данные и нажмите "Рассчитать" для получения результатов
              </div>
            )}
            {loading && (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Выполняется расчёт...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;


