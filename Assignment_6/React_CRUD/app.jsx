const EMPTY_USER = {
  name: "",
  username: "",
  email: "",
  address: { street: "", suite: "", city: "" },
  phone: "",
  website: ""
};

function SearchForm({ onChangeValue }) {
  return (
    <div className="search-wrap">
      <label htmlFor="search">Tìm kiếm</label>
      <input
        id="search"
        type="text"
        placeholder="Tìm theo name, username"
        onChange={(e) => onChangeValue(e.target.value)}
      />
    </div>
  );
}

function AddUser({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [user, setUser] = React.useState(EMPTY_USER);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (["street", "suite", "city"].includes(id)) {
      setUser((prev) => ({
        ...prev,
        address: { ...prev.address, [id]: value }
      }));
    } else {
      setUser((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleAdd = () => {
    if (user.name.trim() === "" || user.username.trim() === "") {
      alert("Vui lòng nhập Name và Username!");
      return;
    }

    onAdd({ ...user, address: { ...user.address } });
    setUser(EMPTY_USER);
    setAdding(false);
  };

  const cancelAdd = () => {
    setUser(EMPTY_USER);
    setAdding(false);
  };

  return (
    <div className="add-user-wrap">
      <button className="btn primary" onClick={() => setAdding(true)}>+ Thêm người dùng</button>

      {adding && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="add-title">
            <h2 id="add-title">Thêm người dùng</h2>
            <UserFormFields user={user} onChange={handleChange} />
            <div className="modal-actions">
              <button className="btn primary" onClick={handleAdd}>Thêm</button>
              <button className="btn" onClick={cancelAdd}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function UserFormFields({ user, onChange }) {
  return (
    <div className="form-grid">
      <label>Name<input id="name" type="text" value={user.name} onChange={onChange} /></label>
      <label>Username<input id="username" type="text" value={user.username} onChange={onChange} /></label>
      <label>Email<input id="email" type="email" value={user.email} onChange={onChange} /></label>
      <label>Phone<input id="phone" type="text" value={user.phone} onChange={onChange} /></label>
      <label>Street<input id="street" type="text" value={user.address.street} onChange={onChange} /></label>
      <label>Suite<input id="suite" type="text" value={user.address.suite} onChange={onChange} /></label>
      <label>City<input id="city" type="text" value={user.address.city} onChange={onChange} /></label>
      <label>Website<input id="website" type="text" value={user.website} onChange={onChange} /></label>
    </div>
  );
}

function ResultTable({ keyword, user, onAdded }) {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [editing, setEditing] = React.useState(null);

  React.useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Không tải được dữ liệu người dùng");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    if (user) {
      setUsers((prev) => {
        const nextId = prev.length ? Math.max(...prev.map((u) => Number(u.id) || 0)) + 1 : 1;
        return [...prev, { ...user, address: { ...user.address }, id: nextId }];
      });
      onAdded();
    }
  }, [user, onAdded]);

  const normalizedKeyword = keyword.trim().toLowerCase();
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(normalizedKeyword) ||
    u.username.toLowerCase().includes(normalizedKeyword)
  );

  function editUser(userToEdit) {
    setEditing({ ...userToEdit, address: { ...userToEdit.address } });
  }

  function handleEditChange(field, value) {
    if (["street", "suite", "city"].includes(field)) {
      setEditing((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
    } else {
      setEditing((prev) => ({ ...prev, [field]: value }));
    }
  }

  function saveUser() {
    setUsers((prev) => prev.map((u) => (u.id === editing.id ? editing : u)));
    setEditing(null);
  }

  function removeUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  if (loading) return <p className="status">Đang tải dữ liệu...</p>;
  if (error) return <p className="status error">Lỗi: {error}</p>;

  return (
    <>
      <div className="table-meta">Hiển thị {filteredUsers.length}/{users.length} người dùng</div>
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.address.street}, {u.address.suite}, {u.address.city}</td>
                <td>{u.phone}</td>
                <td className="actions">
                  <button className="btn small" onClick={() => editUser(u)}>Sửa</button>
                  <button className="btn small danger" onClick={() => removeUser(u.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" role="presentation">
          <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="edit-title">
            <h2 id="edit-title">Sửa người dùng #{editing.id}</h2>
            <UserFormFields
              user={editing}
              onChange={(e) => handleEditChange(e.target.id, e.target.value)}
            />
            <div className="modal-actions">
              <button className="btn primary" onClick={saveUser}>Lưu</button>
              <button className="btn" onClick={() => setEditing(null)}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function App() {
  const [kw, setKeyword] = React.useState("");
  const [newUser, setNewUser] = React.useState(null);

  const clearNewUser = React.useCallback(() => setNewUser(null), []);

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">React CRUD</p>
          <h1>Quản lý người dùng</h1>
          <p>Tìm kiếm, thêm, sửa và xóa người dùng bằng Functional Component và Hooks.</p>
        </div>
      </header>

      <section className="toolbar">
        <SearchForm onChangeValue={setKeyword} />
        <AddUser onAdd={setNewUser} />
      </section>

      <ResultTable keyword={kw} user={newUser} onAdded={clearNewUser} />
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
