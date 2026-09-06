
import { useMemo, useState, useEffect } from 'react';
import scheduleData from './data/schedule.json';
import './App.css';

const DAYS = [
  'Понеділок',
  'Вівторок',
  'Середа',
  'Четвер',
  "П'ятниця",
];

const PAIRS = [1, 2, 3, 4, 5, 6, 7];

const PAIR_TIMES = {
  1: '8.20–9.40',
  2: '9.50–11.10',
  3: '11.30–12.50',
  4: '13.00–14.20',
  5: '14.40–16.00',
  6: '16.10–17.30',
  7: '17.40–19.00',
};

const DEFAULT_SETTINGS = {
  group1: 1,
  group2: 1,
  week: 1,
  darkMode: false,
  compactMode: false,
};

function App() {
  /*
   * Стан налаштувань.
   *
   * При відкритті сайту перевіряємо localStorage.
   * Якщо налаштувань ще немає — використовуємо
   * значення з DEFAULT_SETTINGS.
   */
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings =
        localStorage.getItem('scheduleSettings');

      if (!savedSettings) {
        return DEFAULT_SETTINGS;
      }

      const parsedSettings =
        JSON.parse(savedSettings);

      return {
        ...DEFAULT_SETTINGS,
        ...parsedSettings,
      };
    } catch (error) {
      console.error(
        'Не вдалося завантажити налаштування:',
        error
      );

      return DEFAULT_SETTINGS;
    }
  });

  /*
   * На мобільному екрані налаштування
   * спочатку приховані.
   */
  const [showSelectors, setShowSelectors] =
    useState(false);

  /*
   * Зберігаємо налаштування після кожної зміни.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        'scheduleSettings',
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error(
        'Не вдалося зберегти налаштування:',
        error
      );
    }
  }, [settings]);

  const {
    group1,
    group2,
    week,
    darkMode,
    compactMode,
  } = settings;

  useEffect(() => {
    document.documentElement.classList.toggle('dark-theme', darkMode);
  }, [darkMode]);

  /*
   * Зміна групи
   */
  const handleGroup1Change = (value) => {
    setSettings((current) => ({
      ...current,
      group1: Number(value),
    }));
  };

  /*
   * Зміна підгрупи
   */
  const handleGroup2Change = (value) => {
    setSettings((current) => ({
      ...current,
      group2: Number(value),
    }));
  };

  /*
   * Зміна тижня
   */
  const handleWeekChange = (value) => {
    setSettings((current) => ({
      ...current,
      week: Number(value),
    }));
  };

  const toggleDarkMode = () => {
    setSettings((current) => ({
      ...current,
      darkMode: !current.darkMode,
    }));
  };

  const toggleCompactMode = () => {
    setSettings((current) => ({
      ...current,
      compactMode: !current.compactMode,
    }));
  };

  /*
   * Показати / приховати селектори
   */
  const toggleSelectors = () => {
    setShowSelectors((value) => !value);
  };

  /*
   * Фільтруємо розклад відповідно
   * до групи, підгрупи та тижня.
   */
  /*
 * Розклад тижня (без прив'язки до group1) —
 * щоб потім шукати як по своєму стовпцю,
 * так і по чужих (для підгруп зі списків).
 */
  const weekSchedule = useMemo(() => {
    return scheduleData.filter(
        (item) => item.week === Number(week)
    );
  }, [week]);

  /*
   * Отримуємо заняття для клітинки:
   * 1) спочатку шукаємо у своєму стовпці (group1);
   * 2) якщо там порожньо — шукаємо серед УСІХ
   *    стовпців заняття своєї підгрупи (group2),
   *    бо предмети по 5 спискам можуть стояти
   *    в чужій колонці.
   */
  const getPairsForCell = (day, pairNumber) => {
    const ownColumn = weekSchedule.filter(
        (item) =>
            item.day === day &&
            item.pair === pairNumber &&
            item.group1 === Number(group1) &&
            (item.group2 === null ||
                item.group2 === Number(group2))
    );

    if (ownColumn.length > 0) {
      return ownColumn;
    }

    return weekSchedule
        .filter(
            (item) =>
                item.day === day &&
                item.pair === pairNumber &&
                item.group2 === Number(group2)
        );
  };

  return (
      <div className={`app ${compactMode ? 'compact-mode' : ''}`}>

      {/* =========================
          ВЕРХНЯ ПАНЕЛЬ
          ========================= */}

      <header className="top-bar">

        <div className="top-bar-left">

          {/* Заголовок */}
          <div className="page-title">

            <span className="page-title-main">
              Розклад
            </span>

            <span className="page-title-sub">
              1 курс
            </span>

          </div>


          {/* Селектори */}
          <div
            className={`selectors ${
  showSelectors
      ? 'selectors-visible'
      : ''
}`}
          >

            {/* ГРУПА */}
            <label className="selector">

              <span>
                Група
              </span>

              <select
                value={group1}
                onChange={(e) =>
                  handleGroup1Change(
                    e.target.value
                  )
                }
              >

                {[1, 2, 3, 4, 5, 6, 7].map(
                  (group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group} група
                    </option>
                  )
                )}

              </select>

            </label>


            {/* ПІДГРУПА */}
            <label className="selector">

              <span>
                Підгрупа
              </span>

              <select
                value={group2}
                onChange={(e) =>
                  handleGroup2Change(
                    e.target.value
                  )
                }
              >

                {[1, 2, 3, 4, 5].map(
                  (group) => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group} підгрупа
                    </option>
                  )
                )}

              </select>

            </label>


            {/* ТИЖДЕНЬ */}
            <label className="selector">

              <span>
                Тиждень
              </span>

              <select
                value={week}
                onChange={(e) =>
                  handleWeekChange(
                    e.target.value
                  )
                }
              >

                <option value={1}>
                  1 тиждень
                </option>

                <option value={2}>
                  2 тиждень
                </option>

              </select>

            </label>

          </div>

        </div>


        {/* =========================
            ПРАВА ЧАСТИНА
            ========================= */}

        <div className="top-bar-right">

          {/* Вибрані параметри */}
          <div className="selected-info">
            Група {group1} · підгрупа {group2}
          </div>


          <button
              className={`compact-toggle ${compactMode ? 'active' : ''}`}
              type="button"
              onClick={toggleCompactMode}
              aria-label={
                compactMode
                    ? 'Вимкнути компактний режим'
                    : 'Увімкнути компактний режим'
              }
              title={
                compactMode
                    ? 'Звичайний режим'
                    : 'Компактний режим'
              }
          >
            ▤
          </button>

          {/* Кнопка налаштувань */}
          <button
            className={`selectors-toggle ${
              showSelectors
                  ? 'active'
                  : ''
            }`}
            type="button"
            onClick={toggleSelectors}
            aria-label={
              showSelectors
                ? 'Сховати налаштування'
                : 'Показати налаштування'
            }
            title={
              showSelectors
                ? 'Сховати налаштування'
                : 'Показати налаштування'
            }
          >
            ⚙
          </button>


          {/* Кнопка теми */}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode
                ? 'Увімкнути світлу тему'
                : 'Увімкнути темну тему'
            }
            title={
              darkMode
                ? 'Світла тема'
                : 'Темна тема'
            }
          >

            <span className="theme-icon">
              {darkMode ? '☀' : '☾'}
            </span>

            <span className="theme-text">
              {darkMode
                ? 'Світла'
                : 'Темна'}
            </span>

          </button>

        </div>

      </header>


      {/* =========================
          ТАБЛИЦЯ
          ========================= */}

      <main className="schedule-wrapper">

        <div className="schedule">

          {/* Верхній рядок */}
          <div className="schedule-header">

            <div className="pair-header">
              Пари
            </div>

            {DAYS.map((day) => (
              <div
                key={day}
                className="day-header"
              >
                {day}
              </div>
            ))}

          </div>


          {/* Рядки пар */}
          {PAIRS.map((pairNumber) => (

            <div
              className="schedule-row"
              key={pairNumber}
            >

              {/* Номер та час пари */}
              <div className="pair-number">

                <span>
                  Пара
                </span>

                <strong>
                  {pairNumber}
                </strong>

                {PAIR_TIMES[pairNumber] && (
                  <small>
                    {PAIR_TIMES[pairNumber]}
                  </small>
                )}

              </div>


              {/* Дні */}
              {DAYS.map((day) => {

                const lessons =
                  getPairsForCell(
                    day,
                    pairNumber
                  );

                return (

                  <div
                    className={`schedule-cell ${
  lessons.length === 0
      ? 'empty-cell'
      : ''
}`}
                    key={`${day}-${pairNumber}`}
                  >

                    {lessons.map((lesson) => (

                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                      />

                    ))}

                  </div>

                );
              })}

            </div>

          ))}

        </div>

      </main>

    </div>
  );
}


/*
 * Окрема картка заняття.
 */
function LessonCard({ lesson }) {
  const room =
      lesson.room === null
          ? 'Аудиторія не вказана'
          : lesson.room;

  return (
      <div
          className={`lesson-card ${lesson.isLecture ? 'lecture' : ''}`}
      >
        <div className="lesson-top">
        <span className="week-badge">
          {lesson.week} тиждень
        </span>

          {lesson.group2 !== null && (
              <span className="subgroup-badge">
            Підгрупа {lesson.group2}
          </span>
          )}
        </div>

        <div className="lesson-name">{lesson.name}</div>
        <div className="lesson-teacher">{lesson.teacher}</div>

        <div className="lesson-bottom">
          <span className="lesson-room">{room}</span>
          <span className="lesson-type">
          {lesson.isLecture ? 'Лекція' : 'Практика'}
        </span>
        </div>
      </div>
  );
}


export default App;
