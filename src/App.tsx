import "./App.css";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

type Companion = {
  id: string;
  name: string;
};

type Ritual = {
  id: string;
  title: string;
  companionId: string;
};

type StoredState = {
  companions: Companion[];
  rituals: Ritual[];
};

const storageKey = "rituals-basic:v1";
const soloId = "solo";

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const loadState = (): StoredState => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { companions: [], rituals: [] };

    const parsed = JSON.parse(saved) as StoredState;
    if (!Array.isArray(parsed.companions) || !Array.isArray(parsed.rituals)) {
      return { companions: [], rituals: [] };
    }

    return parsed;
  } catch {
    return { companions: [], rituals: [] };
  }
};

function App() {
  const [companions, setCompanions] = useState<Companion[]>(() => loadState().companions);
  const [rituals, setRituals] = useState<Ritual[]>(() => loadState().rituals);
  const [isAddingRitual, setIsAddingRitual] = useState(false);
  const [ritualTitle, setRitualTitle] = useState("");
  const [ritualCompanionId, setRitualCompanionId] = useState(soloId);
  const [newCompanionName, setNewCompanionName] = useState("");
  const [menuRitualId, setMenuRitualId] = useState<string | null>(null);
  const [pressTimer, setPressTimer] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ companions, rituals }));
  }, [companions, rituals]);

  useEffect(() => {
    if (!menuRitualId) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.closest(`[data-ritual-id="${menuRitualId}"]`)) return;
      setMenuRitualId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [menuRitualId]);

  const companionNameById = useMemo(() => {
    return new Map(companions.map((companion) => [companion.id, companion.name]));
  }, [companions]);

  const groupedRituals = useMemo(() => {
    const groups = new Map<string, Ritual[]>();

    rituals.forEach((ritual) => {
      const groupName =
        ritual.companionId === soloId
          ? "Личные"
          : companionNameById.get(ritual.companionId) ?? "Без привязки";
      groups.set(groupName, [...(groups.get(groupName) ?? []), ritual]);
    });

    return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
  }, [companionNameById, rituals]);

  const addRitual = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = ritualTitle.trim();
    if (!title) return;

    const companionName = newCompanionName.trim();
    const companionId = companionName ? makeId() : ritualCompanionId;

    if (companionName) {
      setCompanions((current) => [{ id: companionId, name: companionName }, ...current]);
    }

    setRituals((current) => [
      { id: makeId(), title, companionId },
      ...current,
    ]);
    setRitualTitle("");
    setRitualCompanionId(soloId);
    setNewCompanionName("");
    setIsAddingRitual(false);
  };

  const deleteRitual = (ritualId: string) => {
    if (!confirm("Удалить ритуал?")) {
      setMenuRitualId(null);
      return;
    }

    setRituals((current) => current.filter((ritual) => ritual.id !== ritualId));
    setMenuRitualId(null);
  };

  const openMenu = (ritualId: string) => {
    setMenuRitualId(ritualId);
  };

  const startPress = (ritualId: string) => {
    window.clearTimeout(pressTimer ?? undefined);
    const timer = window.setTimeout(() => {
      openMenu(ritualId);
    }, 450);
    setPressTimer(timer);
  };

  const endPress = () => {
    window.clearTimeout(pressTimer ?? undefined);
    setPressTimer(null);
  };

  return (
    <main className="app-shell">
      {!isAddingRitual && (
        <section className="header-block">
          <h1 className="page-title">Мои ритуалы</h1>
        </section>
      )}

      {!isAddingRitual && (
        <button
          className="add-icon-button"
          onClick={() => setIsAddingRitual(true)}
          aria-label="Добавить ритуал"
          title="Добавить ритуал"
        >
          <span aria-hidden="true" />
        </button>
      )}

      {isAddingRitual && (
        <section className="workflow">
          <form className="panel" onSubmit={addRitual}>
            <div className="workflow-header">
              <button
                className="back-button"
                type="button"
                onClick={() => {
                  setIsAddingRitual(false);
                  setRitualTitle("");
                  setRitualCompanionId(soloId);
                  setNewCompanionName("");
                }}
                aria-label="Назад"
                title="Назад"
              >
                <span aria-hidden="true" />
              </button>
              <h2>Новый ритуал</h2>
            </div>

          <label>
            Название
            <input
              value={ritualTitle}
              onChange={(event) => setRitualTitle(event.target.value)}
              placeholder="Утренний чай, звонок, прогулка"
            />
          </label>
          <label>
            С кем
            <select
              value={ritualCompanionId}
              onChange={(event) => {
                setRitualCompanionId(event.target.value);
                setNewCompanionName("");
              }}
            >
              <option value={soloId}>Личный</option>
              {companions.map((companion) => (
                <option key={companion.id} value={companion.id}>
                  {companion.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Или новый человек/группа
            <input
              value={newCompanionName}
              onChange={(event) => setNewCompanionName(event.target.value)}
              placeholder="Мама, друзья, команда"
            />
          </label>

          <button type="submit">Добавить</button>
        </form>
      </section>
      )}

      {!isAddingRitual && (
        <section className="rituals-section">
        {groupedRituals.length > 0 ? (
          <div className="groups-list">
            {groupedRituals.map((group) => (
              <section key={group.name} className="group-block">
                <h3>{group.name}</h3>
                <div className="ritual-list">
                  {group.items.map((ritual) => (
                    <article
                      key={ritual.id}
                      className="ritual-card"
                      data-ritual-id={ritual.id}
                      onPointerDown={() => startPress(ritual.id)}
                      onPointerUp={endPress}
                      onPointerLeave={endPress}
                      onPointerCancel={endPress}
                    >
                      <span>{ritual.title}</span>
                      {menuRitualId === ritual.id && (
                        <div className="context-menu">
                          <button type="button" onClick={() => deleteRitual(ritual.id)}>
                            Удалить
                          </button>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="empty-text">Пока нет ритуалов.</p>
        )}
        </section>
      )}
    </main>
  );
}

export default App;
