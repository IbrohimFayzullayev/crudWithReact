import { useEffect, useState } from "react";
import Rodal from "rodal";
import { useForm } from "react-hook-form";
import "rodal/lib/rodal.css";

function App() {
  const [users, setUsers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    let x = localStorage.getItem("data");
    setUsers(x ? JSON.parse(x) : []);
  }, []);

  function saveToLocal() {
    localStorage.setItem("data", JSON.stringify(users));
  }
  function add() {
    setModalVisible(true);
  }
  function closeModal() {
    setModalVisible(false);
  }
  function mySubmit(data) {
    if (isEdit) {
      users[currentItem] = data;
      setUsers([...users]);
      setIsEdit(false);
      setCurrentItem("");
    } else {
      users.push(data);
      setUsers([...users]);
    }
    reset();
    closeModal();
    saveToLocal();
  }
  function deleteItem(index) {
    users.splice(index, 1);
    setUsers([...users]);
    saveToLocal();
  }
  function editItem(index) {
    setModalVisible(true);
    reset(users[index]);
    setIsEdit(true);
    setCurrentItem(index);
  }
  function onSearch(event) {
    let value = event.target.value;
    let data = getFromLocal();

    let x = data.filter((item, index) => {
      return (
        item.firstName.toLowerCase().includes(value.toLowerCase()) ||
        item.lastName.toLowerCase().includes(value.toLowerCase())
      );
    });
    setUsers(x);
  }
  function getFromLocal() {
    return JSON.parse(localStorage.getItem("data"));
  }
  function filterByChecked(event) {
    let data = getFromLocal();
    let active = event.target.checked;
    let x = data.filter((item) => {
      return item.active === active;
    });
    setUsers(x);
  }
  function resetUsers() {
    setUsers(getFromLocal());
  }

  function filterByCountry(event) {
    let value = event.target.value;
    let data = getFromLocal();
    let x = data.filter((item) => {
      return item.country === value;
    });
    setUsers(x);
  }

  return (
    <div className="container py-3">
      <div className="row">
        <div className="col-md-1">
          <button onClick={add} className="btn btn-outline-dark">
            Add
          </button>
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" onChange={onSearch} />
        </div>
        <div className="col-md-2">
          <label>
            Active:
            <input type={"checkbox"} onChange={filterByChecked} />
          </label>
        </div>
        <div className="col-md-3">
          <button className="btn btn-outline-dark" onClick={resetUsers}>
            reset
          </button>
        </div>
        <div className="col-md-3">
          <select className="form-control" onChange={filterByCountry}>
            <option value="UZB">Uzbekistan</option>
            <option value="KAZ">Kazakhistan</option>
            <option value="TAJ">Tadjikistan</option>
          </select>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>FirstName</th>
            <th>LastName</th>
            <th>PhoneNumber</th>
            <th>Active</th>
            <th>Country</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.phoneNumber}</td>
                <td>
                  <input type={"checkbox"} readOnly checked={item.active} />
                </td>
                <td>{item.country}</td>
                <td>
                  <div className="btn-group">
                    <button
                      className="btn btn-outline-dark"
                      onClick={() => {
                        editItem(index);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => deleteItem(index)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Rodal visible={modalVisible} onClose={closeModal} height={340}>
        <form onSubmit={handleSubmit(mySubmit)} className="mt-4">
          <input
            className="form-control my-1"
            type={"text"}
            placeholder="FirstName"
            {...register("firstName")}
          />
          <input
            className="form-control my-1"
            type={"text"}
            placeholder="LastName"
            {...register("lastName")}
          />
          <input
            className="form-control my-1"
            type={"text"}
            placeholder="phoneNumber"
            {...register("phoneNumber")}
          />
          <label>
            Active:
            <input {...register("active")} type={"checkbox"} />
          </label>
          <select {...register("country")} className="form-control my-1">
            <option value={"UZB"}>Uzbekistan</option>
            <option value={"KAZ"}>Kazakhistan</option>
            <option value={"TAJ"}>Tajikistan</option>
          </select>
          {isEdit ? (
            <button className="btn btn-outline-dark">Edit</button>
          ) : (
            <button className="btn btn-outline-dark">Save</button>
          )}
        </form>
      </Rodal>
    </div>
  );
}

export default App;
