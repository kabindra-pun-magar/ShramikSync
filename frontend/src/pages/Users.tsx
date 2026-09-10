import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import API from "../services/api";
import "../styles/Users.css";

// ========================================
// ROLE TYPE
// ========================================

type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

// ========================================
// FORM TYPES
// ========================================

interface UserForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "USER" | "ADMIN";
}

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

interface EditUserForm {
  name: string;
  email: string;
  role: UserRole;
}

interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

// ========================================
// COMPONENT
// ========================================

function Users() {
  // ========================================
  // CURRENT USER
  // ========================================

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [accessLoading, setAccessLoading] =
    useState(true);

  const [accessDenied, setAccessDenied] =
    useState(false);

  // ========================================
  // CREATE USER FORM
  // ========================================

  const [form, setForm] = useState<UserForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });

  // ========================================
  // USERS LIST
  // ========================================

  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // ========================================
  // CREATE USER STATE
  // ========================================

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // EDIT USER STATE
  // ========================================

  const [editingUser, setEditingUser] =
    useState<User | null>(null);

  const [editForm, setEditForm] =
    useState<EditUserForm>({
      name: "",
      email: "",
      role: "USER",
    });

  const [editLoading, setEditLoading] =
    useState(false);

  const [editError, setEditError] =
    useState("");

  const [editSuccess, setEditSuccess] =
    useState("");

  // ========================================
  // STATUS CHANGE STATE
  // ========================================

  const [statusUser, setStatusUser] =
    useState<User | null>(null);

  const [statusLoading, setStatusLoading] =
    useState(false);

  const [statusError, setStatusError] =
    useState("");

  // ========================================
  // ROLE HELPERS
  // ========================================

  const isSuperAdmin =
    currentUser?.role === "SUPER_ADMIN";

  const isAdmin =
    currentUser?.role === "ADMIN";

  // ========================================
  // GET CURRENT USER
  // ========================================

  const fetchCurrentUser = async () => {
    setAccessLoading(true);

    try {
      const response = await API.get("/auth/me");

      const user = response.data.user;

      setCurrentUser(user);

      if (
        user.role !== "ADMIN" &&
        user.role !== "SUPER_ADMIN"
      ) {
        setAccessDenied(true);
        return false;
      }

      setAccessDenied(false);
      return true;
    } catch (err: any) {
      console.error(
        "Fetch current user error:",
        err
      );

      setAccessDenied(true);
      return false;
    } finally {
      setAccessLoading(false);
    }
  };

  // ========================================
  // FETCH USERS
  // ========================================

  const fetchUsers = async () => {
    setUsersLoading(true);

    try {
      const response = await API.get("/users");

      setUsers(response.data.users || []);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch users."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  // ========================================
  // LOAD PAGE
  // ========================================

  useEffect(() => {
    const loadPage = async () => {
      const hasAccess =
        await fetchCurrentUser();

      if (hasAccess) {
        await fetchUsers();
      }
    };

    loadPage();
  }, []);

  // ========================================
  // CREATE FORM CHANGE
  // ========================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ========================================
  // RESET CREATE FORM
  // ========================================

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "USER",
    });

    setError("");
    setSuccess("");
  };

  // ========================================
  // CREATE USER
  // ========================================

  const handleSubmit = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      form.password !==
      form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    // ========================================
    // FRONTEND ROLE PROTECTION
    // ========================================

    if (
      form.role === "ADMIN" &&
      !isSuperAdmin
    ) {
      setError(
        "Only SUPER_ADMIN can create ADMIN accounts."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/users",
        {
          name: form.name,
          email: form.email,
          password: form.password,
          confirmPassword:
            form.confirmPassword,
          role: form.role,
        }
      );

      setSuccess(
        response.data.message ||
          "User created successfully."
      );

      resetForm();

      await fetchUsers();
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to create user."
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // OPEN EDIT MODAL
  // ========================================

  const handleEditClick = (
    user: User
  ) => {
    // ADMIN can edit USER only.
    if (
      isAdmin &&
      user.role !== "USER"
    ) {
      setError(
        "ADMIN users can only modify USER accounts."
      );
      return;
    }

    setEditingUser(user);

    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setEditError("");
    setEditSuccess("");
  };

  // ========================================
  // EDIT FORM CHANGE
  // ========================================

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value as UserRole,
    }));

    setEditError("");
    setEditSuccess("");
  };

  // ========================================
  // CLOSE EDIT MODAL
  // ========================================

  const closeEditModal = () => {
    if (editLoading) {
      return;
    }

    setEditingUser(null);

    setEditForm({
      name: "",
      email: "",
      role: "USER",
    });

    setEditError("");
    setEditSuccess("");
  };

  // ========================================
  // UPDATE USER
  // ========================================

  const handleUpdateUser = async (
    e: FormEvent
  ) => {
    e.preventDefault();

    setEditError("");
    setEditSuccess("");

    if (!editingUser) {
      return;
    }

    const name = editForm.name.trim();
    const email = editForm.email.trim();

    if (
      !name ||
      !email ||
      !editForm.role
    ) {
      setEditError(
        "Name, email, and role are required."
      );
      return;
    }

    // ========================================
    // PREVENT SELF ROLE CHANGE
    // ========================================

    if (
      currentUser &&
      editingUser.id === currentUser.id &&
      editForm.role !== currentUser.role
    ) {
      setEditError(
        "You cannot change your own role."
      );
      return;
    }

    // ========================================
    // ADMIN CAN ONLY MODIFY USER
    // ========================================

    if (
      isAdmin &&
      editingUser.role !== "USER"
    ) {
      setEditError(
        "ADMIN users can only modify USER accounts."
      );
      return;
    }

    // ========================================
    // ADMIN CANNOT CHANGE USER ROLE
    // ========================================

    if (
      isAdmin &&
      editForm.role !== "USER"
    ) {
      setEditError(
        "ADMIN users cannot change user roles."
      );
      return;
    }

    // ========================================
    // SUPER_ADMIN ROLE PROTECTION
    // ========================================

    if (
      editForm.role === "SUPER_ADMIN" &&
      editingUser.role !== "SUPER_ADMIN"
    ) {
      setEditError(
        "SUPER_ADMIN role cannot be assigned through user management."
      );
      return;
    }

    setEditLoading(true);

    try {
      const response = await API.put(
        `/users/${editingUser.id}`,
        {
          name,
          email,
          role: editForm.role,
        }
      );

      setEditSuccess(
        response.data.message ||
          "User updated successfully."
      );

      await fetchUsers();

      setTimeout(() => {
        setEditingUser(null);
        setEditSuccess("");
      }, 700);
    } catch (err: any) {
      console.error(
        "Update user error:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to update user.";

      setEditError(message);
    } finally {
      setEditLoading(false);
    }
  };

  // ========================================
  // OPEN STATUS CONFIRMATION MODAL
  // ========================================

  const handleStatusClick = (
    user: User
  ) => {
    setStatusError("");

    // ========================================
    // PREVENT SELF-DEACTIVATION
    // ========================================

    if (
      currentUser &&
      user.id === currentUser.id &&
      user.isActive
    ) {
      setStatusError(
        "You cannot deactivate your own account."
      );
      return;
    }

    // ========================================
    // ADMIN CAN ONLY MANAGE USER STATUS
    // ========================================

    if (
      isAdmin &&
      user.role !== "USER"
    ) {
      setStatusError(
        "ADMIN users can only change the status of USER accounts."
      );
      return;
    }

    setStatusUser(user);
  };

  // ========================================
  // CLOSE STATUS MODAL
  // ========================================

  const closeStatusModal = () => {
    if (statusLoading) {
      return;
    }

    setStatusUser(null);
    setStatusError("");
  };

  // ========================================
  // ACTIVATE / DEACTIVATE USER
  // ========================================

  const handleStatusChange = async () => {
    if (!statusUser) {
      return;
    }

    // ========================================
    // FRONTEND ROLE PROTECTION
    // ========================================

    if (
      isAdmin &&
      statusUser.role !== "USER"
    ) {
      setStatusError(
        "ADMIN users can only change the status of USER accounts."
      );
      return;
    }

    // ========================================
    // PREVENT SELF-DEACTIVATION
    // ========================================

    if (
      currentUser &&
      statusUser.id === currentUser.id &&
      statusUser.isActive
    ) {
      setStatusError(
        "You cannot deactivate your own account."
      );
      return;
    }

    setStatusLoading(true);
    setStatusError("");
    setError("");
    setSuccess("");

    const newStatus =
      !statusUser.isActive;

    try {
      const response = await API.patch(
        `/users/${statusUser.id}/status`,
        {
          isActive: newStatus,
        }
      );

      setSuccess(
        response.data.message ||
          `User ${
            newStatus
              ? "activated"
              : "deactivated"
          } successfully.`
      );

      setStatusUser(null);

      await fetchUsers();
    } catch (err: any) {
      setStatusError(
        err.response?.data?.message ||
          "Failed to update user status."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (
    date: string
  ) => {
    return new Date(
      date
    ).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ========================================
  // ACCESS LOADING
  // ========================================

  if (accessLoading) {
    return (
      <div className="users-page">
        <div className="users-access-state">
          Checking user permissions...
        </div>
      </div>
    );
  }

  // ========================================
  // ACCESS DENIED
  // ========================================

  if (
    accessDenied ||
    !currentUser ||
    (currentUser.role !== "ADMIN" &&
      currentUser.role !== "SUPER_ADMIN")
  ) {
    return (
      <div className="users-page">
        <div className="users-access-card">
          <span className="users-access-eyebrow">
            ACCESS RESTRICTED
          </span>

          <h1>Access Denied</h1>

          <p>
            User Management is available
            only to administrators.
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // USERS PAGE
  // ========================================

  return (
    <div className="users-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="users-header">
        <div>
          <span className="users-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Create and manage ShramikSync
            system users.
          </p>
        </div>

        <div>
          <span className="users-role-badge">
            {currentUser.role}
          </span>
        </div>
      </div>

      <div className="users-content">

        {/* ========================================
            CREATE USER CARD
        ======================================== */}

        <section className="users-card">

          <div className="users-card-header">
            <div>
              <h2>
                Create New User
              </h2>

              <p>
                Add a new user account to
                the ShramikSync system.
              </p>
            </div>
          </div>

          {success && (
            <div className="users-alert users-alert-success">
              {success}
            </div>
          )}

          {error && (
            <div className="users-alert users-alert-error">
              {error}
            </div>
          )}

          <form
            className="users-form"
            onSubmit={handleSubmit}
          >

            <div className="users-form-row">

              <div className="users-form-group">
                <label htmlFor="name">
                  Full Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  disabled={loading}
                />
              </div>

              <div className="users-form-group">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  disabled={loading}
                />
              </div>

            </div>

            <div className="users-form-row">

              <div className="users-form-group">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  autoComplete="new-password"
                  disabled={loading}
                />

                <span className="users-help">
                  Password must contain at least
                  6 characters.
                </span>
              </div>

              <div className="users-form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

            </div>

            {/* ========================================
                ROLE
            ======================================== */}

            <div className="users-form-group users-role-group">

              <label htmlFor="role">
                User Role
              </label>

              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
                disabled={
                  loading ||
                  !isSuperAdmin
                }
              >

                <option value="USER">
                  USER
                </option>

                {isSuperAdmin && (
                  <option value="ADMIN">
                    ADMIN
                  </option>
                )}

              </select>

              <span className="users-help">
                {isSuperAdmin
                  ? "SUPER_ADMIN can create USER and ADMIN accounts."
                  : "ADMIN can create USER accounts only."}
              </span>

            </div>

            <div className="users-form-actions">

              <button
                type="button"
                className="users-secondary-btn"
                disabled={loading}
                onClick={resetForm}
              >
                Clear
              </button>

              <button
                type="submit"
                className="users-primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Creating User..."
                  : "Create User"}
              </button>

            </div>

          </form>
        </section>

        {/* ========================================
            USER LIST
        ======================================== */}

        <section className="users-card users-list-card">

          <div className="users-card-header users-list-header">

            <div>
              <h2>
                System Users
              </h2>

              <p>
                View and manage registered
                ShramikSync users.
              </p>
            </div>

            <span className="users-count">
              {users.length}{" "}
              {users.length === 1
                ? "User"
                : "Users"}
            </span>

          </div>

          {usersLoading ? (
            <div className="users-table-state">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="users-table-state">
              No users found.
            </div>
          ) : (
            <div className="users-table-wrapper">

              <table className="users-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => {

                    const isCurrentUser =
                      currentUser.id ===
                      user.id;

                    const adminCannotManage =
                      isAdmin &&
                      user.role !== "USER";

                    return (
                      <tr key={user.id}>

                        <td className="users-id">
                          #{user.id}
                        </td>

                        <td>
                          <div className="users-name">

                            {user.name}

                            {isCurrentUser && (
                              <span className="users-you-badge">
                                You
                              </span>
                            )}

                          </div>
                        </td>

                        <td>
                          <div className="users-email">
                            {user.email}
                          </div>
                        </td>

                        <td>
                          <span
                            className={`users-role-badge ${
                              user.role ===
                              "SUPER_ADMIN"
                                ? "users-role-super-admin"
                                : user.role ===
                                  "ADMIN"
                                ? "users-role-admin"
                                : "users-role-user"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`users-status-badge ${
                              user.isActive
                                ? "users-status-active"
                                : "users-status-inactive"
                            }`}
                          >
                            <span className="users-status-dot">
                              ●
                            </span>

                            {user.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </td>

                        <td>
                          <span className="users-date">
                            {formatDate(
                              user.createdAt
                            )}
                          </span>
                        </td>

                        <td>

                          <div className="users-action-group">

                            {/* EDIT */}

                            <button
                              type="button"
                              className={
                                adminCannotManage
                                  ? "users-edit-btn users-action-disabled"
                                  : "users-edit-btn"
                              }
                              onClick={() =>
                                handleEditClick(
                                  user
                                )
                              }
                              disabled={
                                adminCannotManage
                              }
                              title={
                                adminCannotManage
                                  ? "ADMIN can only modify USER accounts"
                                  : "Edit user"
                              }
                            >
                              Edit
                            </button>

                            {/* STATUS */}

                            {isCurrentUser &&
                            user.isActive ? (

                              <button
                                type="button"
                                className="users-status-btn users-status-btn-disabled"
                                onClick={() =>
                                  handleStatusClick(
                                    user
                                  )
                                }
                                title="You cannot deactivate your own account"
                              >
                                Deactivate
                              </button>

                            ) : adminCannotManage ? (

                              <button
                                type="button"
                                className="users-status-btn users-status-btn-disabled"
                                disabled
                                title="ADMIN can only manage USER accounts"
                              >
                                {user.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                            ) : (

                              <button
                                type="button"
                                className={`users-status-btn ${
                                  user.isActive
                                    ? "users-deactivate-btn"
                                    : "users-activate-btn"
                                }`}
                                onClick={() =>
                                  handleStatusClick(
                                    user
                                  )
                                }
                              >
                                {user.isActive
                                  ? "Deactivate"
                                  : "Activate"}
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>
      </div>

      {/* ========================================
          EDIT USER MODAL
      ======================================== */}

      {editingUser && (
        <div
          className="users-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeEditModal();
            }
          }}
        >

          <div
            className="users-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >

            <div className="users-modal-header">

              <div>

                <span className="users-modal-eyebrow">
                  USER MANAGEMENT
                </span>

                <h2 id="edit-user-title">
                  Edit User
                </h2>

                <p>
                  Update the account
                  information for this
                  user.
                </p>

              </div>

              <button
                type="button"
                className="users-modal-close"
                onClick={closeEditModal}
                disabled={editLoading}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {editSuccess && (
              <div className="users-alert users-alert-success">
                {editSuccess}
              </div>
            )}

            {editError && (
              <div className="users-alert users-alert-error">
                {editError}
              </div>
            )}

            <form
              className="users-form"
              onSubmit={handleUpdateUser}
            >

              <div className="users-form-group">

                <label htmlFor="edit-name">
                  Full Name
                </label>

                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  value={editForm.name}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter full name"
                  disabled={editLoading}
                />

              </div>

              <div className="users-form-group">

                <label htmlFor="edit-email">
                  Email Address
                </label>

                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={
                    handleEditChange
                  }
                  placeholder="Enter email address"
                  disabled={editLoading}
                />

              </div>

              <div className="users-form-group">

                <label htmlFor="edit-role">
                  User Role
                </label>

                <select
                  id="edit-role"
                  name="role"
                  value={editForm.role}
                  onChange={
                    handleEditChange
                  }
                  disabled={
                    editLoading ||
                    !isSuperAdmin ||
                    editingUser.id ===
                      currentUser.id
                  }
                >

                  <option value="USER">
                    USER
                  </option>

                  {isSuperAdmin && (
                    <option value="ADMIN">
                      ADMIN
                    </option>
                  )}

                </select>

                {editingUser.id ===
                  currentUser.id && (
                  <span className="users-help">
                    Your own role cannot be
                    changed.
                  </span>
                )}

                {!isSuperAdmin &&
                  editingUser.role ===
                    "USER" && (
                    <span className="users-help">
                      ADMIN users cannot
                      change user roles.
                    </span>
                  )}

              </div>

              <div className="users-edit-info">
                Editing user #
                {editingUser.id}
              </div>

              <div className="users-modal-actions">

                <button
                  type="button"
                  className="users-secondary-btn"
                  onClick={closeEditModal}
                  disabled={editLoading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="users-primary-btn"
                  disabled={editLoading}
                >
                  {editLoading
                    ? "Saving Changes..."
                    : "Save Changes"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================
          ACTIVATE / DEACTIVATE CONFIRMATION
      ======================================== */}

      {statusUser && (
        <div
          className="users-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeStatusModal();
            }
          }}
        >

          <div
            className="users-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-modal-title"
          >

            <div className="users-confirm-icon">
              {statusUser.isActive
                ? "!"
                : "✓"}
            </div>

            <div className="users-confirm-content">

              <h2 id="status-modal-title">
                {statusUser.isActive
                  ? "Deactivate User?"
                  : "Activate User?"}
              </h2>

              <p>
                Are you sure you want to{" "}
                {statusUser.isActive
                  ? "deactivate"
                  : "activate"}{" "}
                <strong>
                  {statusUser.name}
                </strong>
                ?
              </p>

              {statusUser.isActive && (
                <span className="users-confirm-help">
                  This user will no longer be
                  able to log in until an
                  administrator activates
                  the account again.
                </span>
              )}

            </div>

            {statusError && (
              <div className="users-alert users-alert-error">
                {statusError}
              </div>
            )}

            <div className="users-confirm-actions">

              <button
                type="button"
                className="users-secondary-btn"
                onClick={closeStatusModal}
                disabled={statusLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className={
                  statusUser.isActive
                    ? "users-danger-btn"
                    : "users-activate-confirm-btn"
                }
                onClick={
                  handleStatusChange
                }
                disabled={statusLoading}
              >
                {statusLoading
                  ? statusUser.isActive
                    ? "Deactivating..."
                    : "Activating..."
                  : statusUser.isActive
                  ? "Deactivate"
                  : "Activate"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Users;