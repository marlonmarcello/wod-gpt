"use client";

import { useState } from "react";
import Markdown from "react-markdown";

import { generateWod } from "./generate-wod";

export interface Wod {
  id: string;
  exercises: string;
}

export interface FormState {
  work: number;
  rest: number;
  cycles: number;
  total_sets: number;
  unique_sets: number;
  rest_between_sets: number;
  cooldown: number;
}

export interface Form extends FormState {
  equipment: string[];
}

const isServer = typeof window === "undefined";

export default function Home() {
  const [formState, setFormState] = useState<FormState>({
    work: 20,
    rest: 10,
    cycles: 8,
    total_sets: 1,
    unique_sets: 1,
    rest_between_sets: 0,
    cooldown: 0,
  });

  const [wod, setWod] = useState<Wod | undefined>();

  const [savedWods, setSavedWods] = useState<Wod[]>(() =>
    !isServer ? JSON.parse(localStorage.getItem("wods") || `[]`) : [],
  );

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    const value =
      target.type === "number" ? parseInt(target.value) : target.value;
    const stateName = target.name;

    setFormState((cur) => ({
      ...cur,
      [stateName]: value,
    }));
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newWod = await generateWod(formData);

    if (!newWod) return;

    setWod(newWod);
  }

  function handleClickSave() {
    if (!wod || savedWods.find((w) => w.id === wod.id)) return;

    setSavedWods((cur) => {
      const save = [...cur, wod];
      localStorage.setItem(`wods`, JSON.stringify(save));
      return save;
    });
  }

  const {
    work,
    rest,
    cycles,
    total_sets,
    unique_sets,
    rest_between_sets,
    cooldown,
  } = formState;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <form onSubmit={handleFormSubmit} className="block py-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Wokout Generator
        </h1>

        <div className="stats bg-neutral shadow grid mb-4 text-center">
          <div className="stat">
            <div className="stat-title">Total time</div>
            <div className="stat-value">
              {seconds2time(
                totalWorkoutTime({
                  work,
                  rest,
                  cycles,
                  total_sets,
                  rest_between_sets,
                }),
              )}
            </div>
          </div>
        </div>
        {/* <h2>Choose style</h2>
      <label>
        <input type="radio" name="style" value="emom" />
        EMOM
      </label>
      <label>
        <input type="radio" name="style" value="amrap" />
        AMRAP
      </label>
      <label>
        <input type="radio" name="style" value="tabata" />
        Tabata
      </label>
      <label>
        <input type="radio" name="style" value="for-time" />
        For Time
      </label> */}

        <div className="card bg-neutral shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Setup</h2>
            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Prepare</span>
                <span className="label-text-alt">seconds</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="prepare"
                defaultValue={10}
                placeholder="10"
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Work</span>
                <span className="label-text-alt">seconds</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="work"
                placeholder="20"
                value={work}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Rest</span>
                <span className="label-text-alt">seconds</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="rest"
                placeholder="10"
                value={rest}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Cycles</span>
                <span className="label-text-alt">work + rest = cycle</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="cycles"
                placeholder="8"
                value={cycles}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Sets</span>
                <span className="label-text-alt">
                  group of exercises to cycle
                </span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="total_sets"
                placeholder="1"
                value={total_sets}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Unique sets</span>
                <span className="label-text-alt"></span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="unique_sets"
                placeholder="1"
                value={unique_sets}
                max={total_sets}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Rest between sets</span>
                <span className="label-text-alt">seconds</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="rest_between_sets"
                value={rest_between_sets}
                onChange={handleInputChange}
              />
            </label>

            <label className="form-control w-full ">
              <div className="label">
                <span className="label-text">Cooldown</span>
                <span className="label-text-alt">seconds</span>
              </div>
              <input
                className="input input-bordered w-full "
                type="number"
                name="cooldown"
                value={cooldown}
                onChange={handleInputChange}
              />
            </label>
          </div>
        </div>
        <div className="card bg-neutral shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Equipment</h2>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Elastic bands</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary"
                  name="equipment"
                  value="elastic_bands"
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Dumbbells</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary"
                  name="equipment"
                  value="dumbbells"
                />
              </label>
              <label className="label cursor-pointer">
                <span className="label-text">Kettlebells</span>
                <input
                  type="checkbox"
                  defaultChecked
                  className="checkbox checkbox-primary"
                  name="equipment"
                  value="kettlebells"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Generate!
          </button>
        </div>
      </form>
      {wod && (
        <div className="card bg-neutral shadow-xl mb-4">
          <div className="card-body">
            <h2 className="card-title">Wokout of the Day</h2>
            <Markdown className="prose">{wod.exercises}</Markdown>
            <pre>
              <code>{JSON.stringify(wod.exercises, null, 2)}</code>
            </pre>
            <div className="card-actions justify-end">
              <button
                type="submit"
                className="btn btn-secondary"
                onClick={handleClickSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {savedWods.length > 0 && (
        <>
          <h2 className="text-4xl font-bold mb-4 text-center mt-10">
            Saved WODs
          </h2>
          <div className="card bg-neutral shadow-xl">
            <div className="card-body">
              <ul>
                {savedWods.map((wod, i) => (
                  <li key={wod.id}>
                    <Markdown className="prose">{wod.exercises}</Markdown>
                    {i + 1 >= 1 && i < savedWods.length - 1 && (
                      <div className="divider">{i + 1}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function totalWorkoutTime({
  work,
  rest,
  cycles,
  total_sets,
  rest_between_sets,
}: {
  work: number;
  rest: number;
  cycles: number;
  total_sets: number;
  rest_between_sets: number;
}) {
  if (total_sets <= 1) {
    return (work + rest) * cycles;
  }

  return (
    (work + rest) * cycles * total_sets + rest_between_sets * (total_sets - 1)
  );
}

function seconds2time(init: number) {
  let hours = Math.floor(init / 3600);
  let minutes = Math.floor((init - hours * 3600) / 60);
  let seconds = init - hours * 3600 - minutes * 60;
  let time = "";

  if (hours != 0) {
    time = hours + ":";
  }

  if (minutes != 0 || time !== "") {
    const flat = minutes < 10 && time !== "" ? "0" + minutes : String(minutes);
    time += flat + ":";
  }

  if (time === "") {
    time = seconds + "s";
  } else {
    time += seconds < 10 ? "0" + seconds : String(seconds);
  }
  return time;
}
