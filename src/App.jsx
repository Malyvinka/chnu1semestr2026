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

const DEFAULT_SETTINGS = {
  group1: 1,
  group2: 1,
  week: 1,
  darkMode: false,
};

function App() {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem('scheduleSettings');

      if (!savedSettings) {
        return DEFAULT_SETTINGS;
      }

      const parsedSettings = JSON.parse(savedSettings);

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
  } = settings;

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

  /*
   * Зміна теми
   */
  const toggleDarkMode = () => {
    setSettings((current) => ({
      ...current,
      darkMode: !current.darkMode,
    }));
  };

  /*
   * Фільтруємо розклад відповідно
   * до вибраної групи, підгрупи та тижня.
   */
  const filteredSchedule = useMemo(() => {
    return scheduleData.filter((item) => {
      const sameGroup1 =
        item.group1 === Number(group1);

      const sameGroup2 =
        item.group2 === null ||
        item.group2 === Number(group2);

      const sameWeek =
        item.week === Number(week);

      return (
        sameGroup1 &&
        sameGroup2 &&
        sameWeek
      );
    });
  }, [group1, group2, week]);

  /*
   * Отримуємо заняття для конкретної
   * клітинки таблиці.
   */
  const getPairsForCell = (day, pairNumber) => {
    return filteredSchedule.filter(
      (item) =>
        item.day === day &&
        item.pair === pairNumber
    );
  };

  return (
    <div
      className={`app ${
  darkMode ? 'dark-theme' : ''
}`}
    >

      {/* Верхня панель */}
      <header className="top-bar">

        <div className="top-bar-left">

          <div className="page-title">

            <span className="page-title-main">
              Розклад
            </span>

            <span className="page-title-sub">
              1 курс
            </span>

          </div>


          <div className="selectors">

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


        {/* Вибрані параметри */}
        <div className="top-bar-right">

          <div className="selected-info">
            Група {group1} · підгрупа {group2} ·{' '}
            {week} тиждень
          </div>


          {/* Перемикач теми */}
          <button
            className="theme-toggle"
            type="button"
            onClick={toggleDarkMode}
            aria-label={
              darkMode
                ? 'Увімкнути світлу тему'
                : 'Увімкнути темну тему'
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


      {/* Таблиця */}
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

              {/* Номер пари */}
              <div className="pair-number">

                <span>
                  Пара
                </span>

                <strong>
                  {pairNumber}
                </strong>

              </div>


              {/* Понеділок — П'ятниця */}
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
      className={`lesson-card ${
  lesson.isLecture
      ? 'lecture'
      : ''
}`}
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


      <div className="lesson-name">
        {lesson.name}
      </div>


      <div className="lesson-teacher">
        {lesson.teacher}
      </div>


      <div className="lesson-bottom">

        <span className="lesson-room">
          {room}
        </span>

        <span className="lesson-type">
          {lesson.isLecture
            ? 'Лекція'
            : 'Практика'}
        </span>

      </div>

    </div>

  );
}


export default App;

