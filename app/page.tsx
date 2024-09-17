import { CARS } from "@/data/cars";
import { Chat } from "@/components/Chat";

export default function Home() {
  return (
    <main
      className={
        "flex flex-col justify-between items-center p-24 min-h-screen relative "
      }
    >
      <div className={"flex flex-wrap gap-5 justify-center"}>
        {CARS.map(({ vin, logo, model, year, manufacturer, price }) => (
          <section
            key={vin}
            className={
              "w-[400px] border border-gray-400 rounded overflow-hidden"
            }
          >
            <div className={"relative h-0 pb-[56.25%] overflow-hidden"}>
              <img
                src={logo}
                alt={`${manufacturer} ${model} ${year}`}
                className={
                  "absolute inset-0 h-full w-full object-cover object-center"
                }
              />
            </div>
            <div className={"flex flex-col items-center p-2"}>
              <h6
                className={
                  "text-xl overflow-hidden text-ellipsis whitespace-nowrap mb-1"
                }
              >{`${manufacturer} ${model} ${year}`}</h6>
              <p className={"text-base"}> Price: {price}$</p>
            </div>
          </section>
        ))}
      </div>
      <Chat />
    </main>
  );
}
