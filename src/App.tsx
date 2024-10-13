import "./App.css"
import MenuBar from "./components/MenuBar/MenuBar";
import Simulation from "./components/Simulation/Simulation";

function App() {
  return (
    <div className="App">
      <MenuBar />
      <section className="content">
        <Simulation />
      </section>
    </div>
  );
}

export default App;
