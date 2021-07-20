"use strict"

function CalorieCard({name, calorie, list, update}) {
  const deleteElement = () => {
    update(list.filter(item => item.foodName !== name))
  }
  return (
    <div className="calorie-card">
      <div className="name">{name}</div>
      <div className="calories">Contains {calorie} calories</div>
      <div className="delete" onClick={deleteElement}>X</div>
    </div>
  );
}

export default CalorieCard;
