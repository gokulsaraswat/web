import './App.css';
import CalorieList from './CalorieList';
import CalorieCard from './CalorieCard';
import {useState} from "react";

function App() {
  const [list, updateList] = useState(CalorieList)
  return (
    <div className="calorie-list">
      {
        list.map(item => {
          return <CalorieCard
            key={item.foodName}
            name={item.foodName}
            calorie={item.calories}
            list={list}
            update={updateList}
          />
        })
      }
    </div>
  );
}

export default App;
