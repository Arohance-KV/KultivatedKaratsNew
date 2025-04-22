import { Counter } from "./custom-components/Counter"

export const Test = () => {
  return (
    <div className="bg-red-500 w-full h-screen flex justify-center items-center">
      <Counter
        value={1}
        places={[100, 10, 1]}
        fontSize={80}
        padding={5}
        gap={10}
        textColor="white"
        fontWeight={900}
      />
    </div>
  );
};