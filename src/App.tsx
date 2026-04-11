import "./App.css";
import { useMemo, useState } from "react";

type TabKey = "plan" | "places";

type TripDayType = "city" | "nature" | "roadtrip";

type TripDay = {
  day: string;
  title: string;
  type: TripDayType;
  description: string;
  highlights: string[];
};

type Place = {
  id: number;
  name: string;
  category: string;
  duration: string;
  drive: string;
  comfort: string;
  family: boolean;
  grandma: boolean;
  description: string;
};

const tripDays: TripDay[] = [
  {
    day: "День 1",
    title: "Прилет и размещение в южной части Алматы",
    type: "city",
    description:
      "Спокойный день на адаптацию: размещение, короткая прогулка по району и ужин без насыщенной программы.",
    highlights: ["Размещение", "Прогулка по району", "Спокойный вечер"],
  },
  {
    day: "День 2",
    title: "Ботанический сад и nearby-прогулки",
    type: "city",
    description:
      "Легкий городской маршрут с зелеными локациями, кофе-поинтами и прогулкой без длинных переездов.",
    highlights: ["Ботанический сад", "Кафе", "Пеший маршрут"],
  },
  {
    day: "День 3",
    title: "Медеу и Шымбулак",
    type: "nature",
    description:
      "Выезд в горную часть города с подъемником, панорамами и комфортным темпом на полдня или день.",
    highlights: ["Медеу", "Шымбулак", "Панорамы"],
  },
  {
    day: "День 4",
    title: "Парк Первого Президента и южные районы",
    type: "city",
    description:
      "Спокойный городской день с парком, прогулкой по широким улицам и остановками в кафе.",
    highlights: ["Парк", "Прогулка", "Городской ритм"],
  },
  {
    day: "День 5",
    title: "Свободный день в Алматы",
    type: "city",
    description:
      "Резервный день под отдых, повтор понравившихся городских точек или короткий выезд по настроению.",
    highlights: ["Резерв", "Кафе", "Повтор любимых мест"],
  },
  {
    day: "День 6",
    title: "Переезд в район Золотого квадрата",
    type: "city",
    description:
      "Смена городской базы и первое знакомство с центральной частью Алматы в пешем формате.",
    highlights: ["Переезд", "Центр города", "Вечерняя прогулка"],
  },
  {
    day: "День 7",
    title: "Парк 28 панфиловцев и Зеленый базар",
    type: "city",
    description:
      "Классический маршрут по центральным локациям: исторический парк, собор и атмосферный городской рынок.",
    highlights: ["Парк 28 панфиловцев", "Собор", "Зеленый базар"],
  },
  {
    day: "День 8",
    title: "Арбат и центральные улицы",
    type: "city",
    description:
      "Неспешный день в центре: пешеходные улицы, кафе, магазины и городская атмосфера.",
    highlights: ["Арбат", "Пешеходный центр", "Кафе"],
  },
  {
    day: "День 9",
    title: "Кок-Тобе",
    type: "city",
    description:
      "Подъем на городскую обзорную точку с видами на Алматы и легкой прогулкой наверху.",
    highlights: ["Кок-Тобе", "Смотровые", "Вид на город"],
  },
  {
    day: "День 10",
    title: "Музеи и архитектура центра",
    type: "city",
    description:
      "День под культурные точки, спокойные переходы по центру и красивые городские фасады.",
    highlights: ["Музеи", "Архитектура", "Центральные улицы"],
  },
  {
    day: "День 11",
    title: "Терренкур или прогулка вдоль малых рек",
    type: "city",
    description:
      "Легкий зеленый маршрут внутри города для прогулки в спокойном темпе без длительной логистики.",
    highlights: ["Терренкур", "Зеленый маршрут", "Без спешки"],
  },
  {
    day: "День 12",
    title: "Свободный день в центре Алматы",
    type: "city",
    description:
      "Резерв под повтор интересных мест, отдых, кафе или любые локальные планы в центре.",
    highlights: ["Резерв", "Центр", "Гибкий сценарий"],
  },
  {
    day: "День 13",
    title: "Выезд в Саты",
    type: "roadtrip",
    description:
      "Дорога в сторону национальных парков с остановками по пути и спокойным заселением на месте.",
    highlights: ["Дорога", "Саты", "Заселение"],
  },
  {
    day: "День 14",
    title: "Озеро Кольсай",
    type: "nature",
    description:
      "Основной природный день маршрута: озеро, прогулки вдоль воды и смотровые точки в расслабленном темпе.",
    highlights: ["Кольсай", "Прогулка", "Виды на озеро"],
  },
  {
    day: "День 15",
    title: "Чарынский каньон по дороге в Алматы",
    type: "roadtrip",
    description:
      "Обратный маршрут через одну из самых эффектных природных локаций региона и затем возвращение в город.",
    highlights: ["Чарын", "Смотровые", "Возвращение в Алматы"],
  },
  {
    day: "День 16",
    title: "Загородный отдых под Алматы",
    type: "city",
    description:
      "Смена ритма после дороги: восстановление, тишина и короткие локальные прогулки рядом с базой.",
    highlights: ["Загородная база", "Отдых", "Спокойный темп"],
  },
  {
    day: "День 17",
    title: "Городской выезд без центра",
    type: "city",
    description:
      "Маршрут по менее загруженным локациям Алматы с удобным подъездом и без насыщенной программы.",
    highlights: ["Локальные районы", "Кафе", "Короткие переезды"],
  },
  {
    day: "День 18",
    title: "Повтор любимой горной локации",
    type: "nature",
    description:
      "Гибкий день для повторного выезда в горы, если захочется еще раз выбрать панорамы и прохладный воздух.",
    highlights: ["Медеу или Шымбулак", "Горы", "Гибкий выбор"],
  },
  {
    day: "День 19",
    title: "Свободный день под покупки и кафе",
    type: "city",
    description:
      "Неспешный день перед завершением поездки: городской ритм, покупки и спокойные встречи в кафе.",
    highlights: ["Покупки", "Кафе", "Свободный график"],
  },
  {
    day: "День 20",
    title: "Финальный день в Алматы",
    type: "city",
    description:
      "Завершающий день без дальних выездов, с короткой прогулкой и удобным завершением маршрута.",
    highlights: ["Финальная прогулка", "Спокойный режим", "Завершение поездки"],
  },
];

const places: Place[] = [
  {
    id: 1,
    name: "Центр Алматы",
    category: "Город",
    duration: "Полдня / день",
    drive: "На месте",
    comfort: "Очень легко",
    family: true,
    grandma: true,
    description:
      "Лучший вариант для городской жизни: прогулки, кафе, зелень и простая логистика.",
  },
  {
    id: 2,
    name: "Парк 28 панфиловцев",
    category: "Город",
    duration: "1–2 часа",
    drive: "Короткая поездка",
    comfort: "Легко",
    family: true,
    grandma: true,
    description:
      "Спокойная прогулочная точка, которую удобно совмещать с центром и базаром.",
  },
  {
    id: 3,
    name: "Зелёный базар",
    category: "Город",
    duration: "1–1.5 часа",
    drive: "Короткая поездка",
    comfort: "Средне",
    family: true,
    grandma: true,
    description:
      "Атмосферное место для городской жизни, еды и ощущения местного ритма.",
  },
  {
    id: 4,
    name: "Медеу",
    category: "Горы",
    duration: "Полдня",
    drive: "30–40 мин",
    comfort: "Легко",
    family: true,
    grandma: true,
    description:
      "Один из самых простых способов почувствовать горы без тяжёлого выезда.",
  },
  {
    id: 5,
    name: "Шымбулак",
    category: "Горы",
    duration: "Полдня / день",
    drive: "40–60 мин",
    comfort: "Легко-средне",
    family: true,
    grandma: true,
    description:
      "Красивая горная точка с удобной туристической инфраструктурой.",
  },
  {
    id: 6,
    name: "БАО",
    category: "Природа",
    duration: "Полдня",
    drive: "1.5–2 часа с дорогой",
    comfort: "Средне",
    family: true,
    grandma: false,
    description:
      "Очень красивая вылазка, но лучше учитывать дорогу, погоду и общий комфорт.",
  },
  {
    id: 7,
    name: "Саты",
    category: "База",
    duration: "1–2 ночи",
    drive: "4–5 часов",
    comfort: "Средне",
    family: true,
    grandma: false,
    description:
      "Удобная база для Кольсая, Каинды и более природной части маршрута.",
  },
  {
    id: 8,
    name: "Кольсай",
    category: "Природа",
    duration: "Полдня / день",
    drive: "Недалеко от Саты",
    comfort: "Средне",
    family: true,
    grandma: false,
    description:
      "Одна из самых красивых и относительно комфортных природных точек поездки.",
  },
  {
    id: 9,
    name: "Каинды",
    category: "Природа",
    duration: "Полдня",
    drive: "Через трансфер",
    comfort: "Сложнее",
    family: true,
    grandma: false,
    description:
      "Очень эффектное место, но логистика и комфорт сложнее, чем у Кольсая.",
  },
  {
    id: 10,
    name: "Чарынский каньон",
    category: "Природа",
    duration: "Полдня / день",
    drive: "Далеко",
    comfort: "Средне",
    family: true,
    grandma: false,
    description:
      "Одна из самых впечатляющих локаций региона, особенно как отдельный день.",
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("plan");
  const [selectedCategory, setSelectedCategory] = useState<string>("Все");

  const categories = useMemo(
    () => ["Все", ...new Set(places.map((place) => place.category))],
    []
  );

  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "Все") return places;
    return places.filter((place) => place.category === selectedCategory);
  }, [selectedCategory]);

  const renderTypeLabel = (type: TripDayType) => {
    if (type === "city") return "Город";
    if (type === "nature") return "Природа";
    return "Переезд";
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <header className="top-hero">
          <div className="top-row">
            <div>
              <p className="mini-label">Travel App</p>
              <h1>Алматы</h1>
            </div>
            <div className="weather-chip">Май 2026</div>
          </div>

          <p className="hero-description">
            План поездки по Алматы и окрестностям с двумя основными разделами:
            маршрут по дням и список ключевых мест.
          </p>

          <div className="hero-cards">
            <div className="hero-card">
              <span className="hero-value">{tripDays.length}</span>
              <span className="hero-title">дней</span>
            </div>
            <div className="hero-card">
              <span className="hero-value">{places.length}</span>
              <span className="hero-title">локаций</span>
            </div>
          </div>
        </header>

        <main className="screen-content">
          {activeTab === "plan" && (
            <section className="screen-section">
              <div className="section-title-row">
                <h2>Маршрут</h2>
                <span className="section-note">{tripDays.length} дней</span>
              </div>

              <div className="timeline-list">
                {tripDays.map((item) => (
                  <article key={item.day} className={`timeline-card ${item.type}`}>
                    <div className="timeline-header">
                      <span className="day-pill">{item.day}</span>
                      <span className="type-pill">{renderTypeLabel(item.type)}</span>
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>

                    <div className="tag-row">
                      {item.highlights.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeTab === "places" && (
            <section className="screen-section">
              <div className="section-title-row">
                <h2>Места</h2>
                <span className="section-note">{filteredPlaces.length} точек</span>
              </div>

              <div className="filters-row">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={
                      selectedCategory === category
                        ? "filter-chip active"
                        : "filter-chip"
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="places-list">
                {filteredPlaces.map((place) => (
                  <article key={place.id} className="place-card">
                    <div className="place-top">
                      <span className="place-category">{place.category}</span>
                      <span className="place-duration">{place.duration}</span>
                    </div>

                    <h3>{place.name}</h3>
                    <p>{place.description}</p>

                    <div className="meta-grid">
                      <div className="meta-box">
                        <span className="meta-label">Дорога</span>
                        <span className="meta-value">{place.drive}</span>
                      </div>
                      <div className="meta-box">
                        <span className="meta-label">Комфорт</span>
                        <span className="meta-value">{place.comfort}</span>
                      </div>
                    </div>

                    <div className="badges-row">
                      <span className={place.family ? "status-badge good" : "status-badge"}>
                        С ребёнком
                      </span>
                      <span
                        className={place.grandma ? "status-badge good" : "status-badge muted"}
                      >
                        С бабушкой
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>

      <nav className="bottom-nav">
          <button
            className={activeTab === "plan" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("plan")}
          >
            <span className="nav-icon">◫</span>
            <span className="nav-label">Маршрут</span>
          </button>

          <button
            className={activeTab === "places" ? "nav-item active" : "nav-item"}
            onClick={() => setActiveTab("places")}
          >
            <span className="nav-icon">⌖</span>
            <span className="nav-label">Места</span>
          </button>
        </nav>
    </div>
  );
}

export default App;
