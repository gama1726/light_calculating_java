/**
 * E2E тест расчётов: отправка данных из методички Тюлюпова на API и проверка результатов.
 *
 * Запуск:
 *   1. Запустите бэкенд (в backend-java: mvn spring-boot:run).
 *   2. В корне проекта: node test-calculation-e2e.js
 *
 * Требуется: бэкенд на http://localhost:8000 (после пересборки с @JsonProperty("A") в InputData).
 */

const API_URL = 'http://localhost:8000/api/calculate';

// Важно: перезапустите бэкенд после изменений (mvn spring-boot:run в backend-java). Тогда API примет A,B,H и вернёт корректные P_r_osv, S_total и т.д.
// Jackson без @JsonProperty("A") сопоставляет getA() с "a"; в InputData добавлен @JsonProperty("A") — отправляем A, B, H.
const inputFromMethodology = {
  A: 50,
  B: 67,
  H: 3,
  h_p: 0.7,
  h_c: 0.3,
  E_n: 400,
  lamp_type: 'LED',
  n_sockets: 10,
  P_nom_list: [1.2, 5.2, 3.7, 6.2, 6.8, 3.4, 7.2, 2.7, 4.9, 1.9, 7.6, 5.2, 1.4, 2.8, 6.7, 3.4, 4.9, 4.5, 4.6, 1.4],
  cos_phi_list: Array(20).fill(0.8),
  category: 3,
  U_HV: 10,
  L_KL: 1.25,
  S_fundament: 21,
  L_step: 2.25,
  I_otkl: 12.5,
};

// Ожидаемые значения по методичке (допуск в % или абсолютный)
const expected = {
  lighting: {
    h: 2,
    i: 14.32,
    N_a: 22,
    N_b: 30,
    N: 660,
    Phi_total: 165000,
    P_lamp: 3,
    P_r_osv: 1.98,
    S_r_osv: 2.084,
    I_r_osv: 3.34,
    n_a: 33,
  },
  sockets: {
    P_r_sockets: 9.6,
    Ks: 0.8,
    S_r_sockets: 10.67,
  },
  ep_group: {
    P_sum: 68.56,
    S_p: 81.415,
    I_p: 123.8,
  },
  transformer: {
    S_total: 96829,
    transformer_model: 'ТМ-100',
    S_nom: 100,
  },
  conductors_lighting_feed: { section: 16, Delta_U: 1.2 },
  conductors_lighting_row: { section: 10 },
  short_circuit_point1: { I_k3: 4.6, Z_eq: 50 },
  grounding: { R_total: 4, N_v: 4 },
};

function approx(a, b, relTol = 0.05, absTol = 0.01) {
  if (typeof a !== 'number' || typeof b !== 'number') return false;
  const diff = Math.abs(a - b);
  if (b === 0) return diff <= absTol;
  return diff <= Math.max(absTol, Math.abs(b) * relTol);
}

function runTest() {
  return fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inputFromMethodology),
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
      return r.json();
    })
    .then((data) => {
      const errors = [];
      const lighting = data.lighting || {};
      const sockets = data.sockets || {};
      const ep_group = data.ep_group || {};
      const transformer = data.transformer || {};
      const conductors = data.conductors || [];
      const short_circuit = data.short_circuit || [];
      const grounding = data.grounding || {};

      if (!approx(lighting.h, expected.lighting.h, 0.02)) {
        errors.push(`Освещение h: ожидалось ${expected.lighting.h}, получено ${lighting.h}`);
      }
      if (!approx(lighting.i, expected.lighting.i, 0.05)) {
        errors.push(`Освещение i: ожидалось ~${expected.lighting.i}, получено ${lighting.i}`);
      }
      if (lighting.N_a !== expected.lighting.N_a) {
        errors.push(`Освещение N_a: ожидалось ${expected.lighting.N_a}, получено ${lighting.N_a}`);
      }
      if (lighting.N_b !== expected.lighting.N_b) {
        errors.push(`Освещение N_b: ожидалось ${expected.lighting.N_b}, получено ${lighting.N_b}`);
      }
      const totalN = lighting.N ?? lighting.n;
      if (totalN !== undefined && totalN !== expected.lighting.N) {
        errors.push(`Освещение N: ожидалось ${expected.lighting.N}, получено ${totalN}`);
      }
      if (!approx(lighting.P_r_osv, expected.lighting.P_r_osv, 0.02)) {
        errors.push(`Освещение P_r_osv: ожидалось ${expected.lighting.P_r_osv}, получено ${lighting.P_r_osv}`);
      }
      if (!approx(lighting.S_r_osv, expected.lighting.S_r_osv, 0.05)) {
        errors.push(`Освещение S_r_osv: ожидалось ~${expected.lighting.S_r_osv}, получено ${lighting.S_r_osv}`);
      }
      if (!approx(lighting.I_r_osv, expected.lighting.I_r_osv, 0.1)) {
        errors.push(`Освещение I_r_osv: ожидалось ~${expected.lighting.I_r_osv}, получено ${lighting.I_r_osv}`);
      }
      const nA = lighting.n_a ?? lighting.n_a_emergency;
      if (expected.lighting.n_a && nA !== undefined && (nA < expected.lighting.n_a - 2 || nA > expected.lighting.n_a + 2)) {
        errors.push(`Освещение n_a: ожидалось ~${expected.lighting.n_a}, получено ${nA}`);
      }

      if (!approx(sockets.P_r_sockets, expected.sockets.P_r_sockets, 0.15)) {
        errors.push(`Розетки P_r_sockets: ожидалось ~${expected.sockets.P_r_sockets}, получено ${sockets.P_r_sockets}`);
      }
      if (sockets.Ks !== undefined && sockets.Ks !== expected.sockets.Ks && !approx(sockets.Ks, expected.sockets.Ks, 0.01)) {
        errors.push(`Розетки Ks: ожидалось ${expected.sockets.Ks}, получено ${sockets.Ks}`);
      }

      if (!approx(ep_group.P_sum, expected.ep_group.P_sum, 0.05)) {
        errors.push(`ЭП P_sum: ожидалось ~${expected.ep_group.P_sum}, получено ${ep_group.P_sum}`);
      }
      if (!approx(ep_group.S_p, expected.ep_group.S_p, 0.05)) {
        errors.push(`ЭП S_p: ожидалось ~${expected.ep_group.S_p}, получено ${ep_group.S_p}`);
      }
      if (!approx(ep_group.I_p, expected.ep_group.I_p, 0.1)) {
        errors.push(`ЭП I_p: ожидалось ~${expected.ep_group.I_p}, получено ${ep_group.I_p}`);
      }

      if (transformer.S_total && !approx(transformer.S_total / 1000, expected.transformer.S_total / 1000, 0.08)) {
        errors.push(`Трансформатор S_total: ожидалось ~${expected.transformer.S_total / 1000} кВА, получено ${transformer.S_total}`);
      }
      if (transformer.transformer_model && !transformer.transformer_model.includes('ТМ-100') && !transformer.transformer_model.includes('100')) {
        errors.push(`Трансформатор: ожидалась модель ~ТМ-100/10, получено ${transformer.transformer_model}`);
      }

      const feedLight = conductors.find((c) => c.name && c.name.includes('Питающая') && c.name.includes('освещ'));
      if (feedLight) {
        if (feedLight.section < expected.conductors_lighting_feed.section - 4 || feedLight.section > expected.conductors_lighting_feed.section + 4) {
          errors.push(`Провод питающей освещения: ожидалось сечение ~${expected.conductors_lighting_feed.section} мм², получено ${feedLight.section}`);
        }
      }
      const rowLight = conductors.find((c) => c.name && c.name.includes('ряд'));
      if (rowLight && expected.conductors_lighting_row.section) {
        if (rowLight.section < expected.conductors_lighting_row.section - 2 || rowLight.section > expected.conductors_lighting_row.section + 4) {
          errors.push(`Провод на ряд освещения: ожидалось сечение ~${expected.conductors_lighting_row.section} мм², получено ${rowLight.section}`);
        }
      }

      const sc1 = short_circuit.find((s) => s.point && s.point.includes('ТП')) || short_circuit[0];
      if (sc1 && !approx(sc1.I_k3, expected.short_circuit_point1.I_k3, 0.15)) {
        errors.push(`КЗ точка 1 I_k3: ожидалось ~${expected.short_circuit_point1.I_k3} кА, получено ${sc1.I_k3}`);
      }

      if (grounding.R_total !== undefined && grounding.R_total > expected.grounding.R_total + 0.5) {
        errors.push(`Заземление R_total: должно быть ≤${expected.grounding.R_total} Ом, получено ${grounding.R_total}`);
      }

      return { data, errors };
    });
}

runTest()
  .then(({ data, errors }) => {
    console.log('=== Тест расчётов по методичке Тюлюпова (A=50, B=67, H=3, 10 розеток, 20 ЭП) ===\n');
    if (errors.length === 0) {
      console.log('Все проверки пройдены.\n');
    } else {
      console.log('Обнаружены расхождения:\n');
      errors.forEach((e) => console.log('  -', e));
      console.log('');
    }
    console.log('Полученные значения:');
    console.log('  Освещение: h=', data.lighting?.h, ', N_a=', data.lighting?.N_a, ', N_b=', data.lighting?.N_b, ', N=', data.lighting?.N ?? data.lighting?.n);
    console.log('  P_r_osv=', data.lighting?.P_r_osv, 'кВт, S_r_osv=', data.lighting?.S_r_osv, 'кВА, I_r_osv=', data.lighting?.I_r_osv, 'А');
    console.log('  Розетки: P_r_sockets=', data.sockets?.P_r_sockets, 'кВт, Ks=', data.sockets?.Ks);
    console.log('  ЭП: S_p=', data.ep_group?.S_p, 'кВА, I_p=', data.ep_group?.I_p, 'А');
    console.log('  Трансформатор: S_total=', data.transformer?.S_total, 'ВА, модель=', data.transformer?.transformer_model);
    const feed = (data.conductors || []).find((c) => c.name && c.name.includes('Питающая') && c.name.includes('освещ'));
    if (feed) console.log('  Провод питающей освещения: S=', feed.section, 'мм²');
    const sc1 = (data.short_circuit || []).find((s) => s.point && s.point.includes('ТП')) || data.short_circuit?.[0];
    if (sc1) console.log('  КЗ точка 1: I_k3=', sc1.I_k3, 'кА, Z_eq=', sc1.Z_eq?.toFixed(2), 'Ом');
    console.log('  Заземление: R_total=', data.grounding?.R_total, 'Ом, N_v=', data.grounding?.N_v);
    process.exit(errors.length > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Ошибка теста:', err.message);
    if (err.message.includes('fetch')) {
      console.error('Убедитесь, что бэкенд запущен на http://localhost:8000');
    }
    process.exit(1);
  });
