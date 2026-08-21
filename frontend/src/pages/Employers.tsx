import { useEffect, useState } from "react";
import type {
    ChangeEvent,
    FormEvent,
} from "react";

import api from "../services/api";
import "../styles/Employers.css";

// ========================================
// TYPES
// ========================================

interface Employer {
    id: number;

    companyName: string;

    contactPerson: string | null;

    email: string | null;

    phone: string | null;

    country: string | null;

    city: string | null;

    address: string | null;

    industry: string | null;

    companyType: string | null;

    status:
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING";

    createdAt: string;

    updatedAt: string;

    createdById: number;
}

interface EmployersResponse {
    success: boolean;

    count: number;

    employers: Employer[];
}

interface EmployerForm {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address: string;
    industry: string;
    companyType: string;

    status:
    | "ACTIVE"
    | "INACTIVE"
    | "PENDING";
}

// ========================================
// INITIAL FORM
// ========================================

const initialForm: EmployerForm = {
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    industry: "",
    companyType: "",
    status: "PENDING",
};

// ========================================
// COMPONENT
// ========================================

function Employers() {

    // ========================================
    // EMPLOYER STATE
    // ========================================

    const [employers, setEmployers] =
        useState<Employer[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ========================================
    // FORM STATE
    // ========================================

    const [showForm, setShowForm] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [updating, setUpdating] =
        useState(false);

    const [form, setForm] =
        useState<EmployerForm>(initialForm);

    const [editingEmployer, setEditingEmployer] =
        useState<Employer | null>(null);

    // ========================================
    // VIEW STATE
    // ========================================

    const [viewingEmployer, setViewingEmployer] =
        useState<Employer | null>(null);

    const [viewLoading, setViewLoading] =
        useState(false);

    // ========================================
    // DELETE STATE
    // ========================================

    const [deletingId, setDeletingId] =
        useState<number | null>(null);

    // ========================================
    // SEARCH / FILTER STATE
    // ========================================

    const [search, setSearch] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("");

    // ========================================
    // FETCH EMPLOYERS
    // ========================================

    const fetchEmployers = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await api.get<EmployersResponse>(
                    "/employers"
                );

            if (!response.data.success) {

                setError(
                    "Failed to load employers."
                );

                return;
            }

            setEmployers(
                response.data.employers
            );

        } catch (error: any) {

            console.error(
                "Get employers error:",
                error
            );

            if (
                error.response?.status === 401
            ) {
                return;
            }

            setError(
                error.response?.data?.message ||
                "Failed to load employers."
            );

        } finally {

            setLoading(false);

        }
    };

    // ========================================
    // INITIAL LOAD
    // ========================================

    useEffect(() => {

        fetchEmployers();

    }, []);

    // ========================================
    // HANDLE FORM CHANGE
    // ========================================

    const handleChange = (
        event: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ) => {

        const {
            name,
            value,
        } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ========================================
    // OPEN CREATE FORM
    // ========================================

    const handleOpenForm = () => {

        setEditingEmployer(null);

        setForm(initialForm);

        setError("");

        setSuccess("");

        setShowForm(true);
    };

    // ========================================
    // CLOSE FORM
    // ========================================

    const handleCloseForm = () => {

        if (
            submitting ||
            updating
        ) {
            return;
        }

        setShowForm(false);

        setEditingEmployer(null);

        setForm(initialForm);

        setError("");
    };

    // ========================================
    // CREATE EMPLOYER
    // ========================================

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !form.companyName.trim()
        ) {

            setError(
                "Company name is required."
            );

            return;
        }

        try {

            setSubmitting(true);

            const response =
                await api.post<{
                    success: boolean;
                    message: string;
                    employer: Employer;
                }>(
                    "/employers",
                    {
                        companyName:
                            form.companyName.trim(),

                        contactPerson:
                            form.contactPerson.trim() ||
                            null,

                        email:
                            form.email.trim() ||
                            null,

                        phone:
                            form.phone.trim() ||
                            null,

                        country:
                            form.country.trim() ||
                            null,

                        city:
                            form.city.trim() ||
                            null,

                        address:
                            form.address.trim() ||
                            null,

                        industry:
                            form.industry.trim() ||
                            null,

                        companyType:
                            form.companyType.trim() ||
                            null,

                        status:
                            form.status,
                    }
                );

            if (
                !response.data.success
            ) {

                setError(
                    response.data.message ||
                    "Failed to create employer."
                );

                return;
            }

            setEmployers(
                (previous) => [
                    response.data.employer,
                    ...previous,
                ]
            );

            setForm(initialForm);

            setShowForm(false);

            setSuccess(
                "Employer created successfully."
            );

        } catch (error: any) {

            console.error(
                "Create employer error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to create employer."
            );

        } finally {

            setSubmitting(false);

        }
    };

    // ========================================
    // VIEW EMPLOYER
    // ========================================

    const handleViewEmployer = async (
        employerId: number
    ) => {

        try {

            setViewLoading(true);

            setError("");

            const response =
                await api.get<{
                    success: boolean;
                    employer: Employer;
                }>(
                    `/employers/${employerId}`
                );

            if (
                !response.data.success
            ) {

                setError(
                    "Failed to load employer details."
                );

                return;
            }

            setViewingEmployer(
                response.data.employer
            );

        } catch (error: any) {

            console.error(
                "Get employer details error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load employer details."
            );

        } finally {

            setViewLoading(false);

        }
    };

    // ========================================
    // START EDIT EMPLOYER
    // ========================================

    const handleEditEmployer = (
        employer: Employer
    ) => {

        setEditingEmployer(employer);

        setForm({

            companyName:
                employer.companyName,

            contactPerson:
                employer.contactPerson || "",

            email:
                employer.email || "",

            phone:
                employer.phone || "",

            country:
                employer.country || "",

            city:
                employer.city || "",

            address:
                employer.address || "",

            industry:
                employer.industry || "",

            companyType:
                employer.companyType || "",

            status:
                employer.status,
        });

        setError("");

        setSuccess("");

        setViewingEmployer(null);

        setShowForm(true);
    };

    // ========================================
    // UPDATE EMPLOYER
    // ========================================

    const handleUpdateEmployer = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (!editingEmployer) {
            return;
        }

        setError("");
        setSuccess("");

        if (
            !form.companyName.trim()
        ) {

            setError(
                "Company name is required."
            );

            return;
        }

        try {

            setUpdating(true);

            const response =
                await api.put<{
                    success: boolean;
                    message: string;
                    employer: Employer;
                }>(
                    `/employers/${editingEmployer.id}`,
                    {
                        companyName:
                            form.companyName.trim(),

                        contactPerson:
                            form.contactPerson.trim() ||
                            null,

                        email:
                            form.email.trim() ||
                            null,

                        phone:
                            form.phone.trim() ||
                            null,

                        country:
                            form.country.trim() ||
                            null,

                        city:
                            form.city.trim() ||
                            null,

                        address:
                            form.address.trim() ||
                            null,

                        industry:
                            form.industry.trim() ||
                            null,

                        companyType:
                            form.companyType.trim() ||
                            null,

                        status:
                            form.status,
                    }
                );

            if (
                !response.data.success
            ) {

                setError(
                    response.data.message ||
                    "Failed to update employer."
                );

                return;
            }

            setEmployers(
                (previous) =>
                    previous.map(
                        (employer) =>
                            employer.id ===
                                response.data.employer.id
                                ? response.data.employer
                                : employer
                    )
            );

            setForm(initialForm);

            setEditingEmployer(null);

            setShowForm(false);

            setSuccess(
                "Employer updated successfully."
            );

        } catch (error: any) {

            console.error(
                "Update employer error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to update employer."
            );

        } finally {

            setUpdating(false);

        }
    };

    // ========================================
    // DELETE EMPLOYER
    // ========================================

    const handleDeleteEmployer = async (
        employerId: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this employer?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setDeletingId(employerId);

            setError("");
            setSuccess("");

            const response =
                await api.delete<{
                    success: boolean;
                    message: string;
                }>(
                    `/employers/${employerId}`
                );

            if (
                !response.data.success
            ) {

                setError(
                    response.data.message ||
                    "Failed to delete employer."
                );

                return;
            }

            setEmployers(
                (previous) =>
                    previous.filter(
                        (employer) =>
                            employer.id !==
                            employerId
                    )
            );

            setSuccess(
                "Employer deleted successfully."
            );

        } catch (error: any) {

            console.error(
                "Delete employer error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to delete employer."
            );

        } finally {

            setDeletingId(null);

        }
    };

    // ========================================
    // FILTER EMPLOYERS
    // ========================================

    const filteredEmployers =
        employers.filter(
            (employer) => {

                const searchValue =
                    search
                        .trim()
                        .toLowerCase();

                const matchesSearch =
                    !searchValue ||
                    employer.companyName
                        .toLowerCase()
                        .includes(searchValue) ||
                    employer.contactPerson
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    employer.email
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    employer.phone
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    employer.country
                        ?.toLowerCase()
                        .includes(searchValue) ||
                    employer.city
                        ?.toLowerCase()
                        .includes(searchValue);

                const matchesStatus =
                    !statusFilter ||
                    employer.status ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );
            }
        );

    // ========================================
    // CLEAR FILTERS
    // ========================================

    const handleClearFilters = () => {

        setSearch("");

        setStatusFilter("");
    };

    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="employers-page">

                <div className="employers-state">

                    <h2>
                        Loading Employers
                    </h2>

                    <p>
                        Fetching employers from the
                        database...
                    </p>

                </div>

            </div>
        );
    }

    // ========================================
    // PAGE
    // ========================================

    return (

        <div className="employers-page">

            {/* ========================================
                HEADER
            ======================================== */}

            <header className="employers-header">

                <div>

                    <span className="employers-eyebrow">
                        RECRUITMENT MANAGEMENT
                    </span>

                    <h1>
                        Employers
                    </h1>

                    <p>
                        Manage employers registered
                        in your recruitment system.
                    </p>

                </div>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={
                        handleOpenForm
                    }
                >
                    Add Employer
                </button>

            </header>

            {/* ========================================
                SUCCESS MESSAGE
            ======================================== */}

            {success && (

                <div className="employer-message employer-success">

                    {success}

                </div>

            )}

            {/* ========================================
                ERROR MESSAGE
            ======================================== */}

            {error && (

                <div className="employer-message employer-error">

                    <span>
                        {error}
                    </span>

                </div>

            )}

            {/* ========================================
                FORM
            ======================================== */}

            {showForm && (

                <section className="card employer-form-panel">

                    <div className="employer-panel-header">

                        <div>

                            <h2>
                                {editingEmployer
                                    ? "Edit Employer"
                                    : "Add Employer"}
                            </h2>

                            <p>
                                {editingEmployer
                                    ? "Update employer information."
                                    : "Register a new employer in the recruitment system."}
                            </p>

                        </div>

                    </div>

                    <form
                        className="employer-form-grid"
                        onSubmit={
                            editingEmployer
                                ? handleUpdateEmployer
                                : handleSubmit
                        }
                    >

                        {/* Company Name */}

                        <div className="employer-field">

                            <label htmlFor="companyName">
                                Company Name *
                            </label>

                            <input
                                id="companyName"
                                name="companyName"
                                type="text"
                                value={
                                    form.companyName
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="ABC International Recruitment"
                                required
                            />

                        </div>

                        {/* Contact Person */}

                        <div className="employer-field">

                            <label htmlFor="contactPerson">
                                Contact Person
                            </label>

                            <input
                                id="contactPerson"
                                name="contactPerson"
                                type="text"
                                value={
                                    form.contactPerson
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Ram Sharma"
                            />

                        </div>

                        {/* Email */}

                        <div className="employer-field">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={
                                    form.email
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="ram@abc.com"
                            />

                        </div>

                        {/* Phone */}

                        <div className="employer-field">

                            <label htmlFor="phone">
                                Phone
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={
                                    form.phone
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="+9779800000000"
                            />

                        </div>

                        {/* Country */}

                        <div className="employer-field">

                            <label htmlFor="country">
                                Country
                            </label>

                            <input
                                id="country"
                                name="country"
                                type="text"
                                value={
                                    form.country
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Nepal"
                            />

                        </div>

                        {/* City */}

                        <div className="employer-field">

                            <label htmlFor="city">
                                City
                            </label>

                            <input
                                id="city"
                                name="city"
                                type="text"
                                value={
                                    form.city
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Kathmandu"
                            />

                        </div>

                        {/* Industry */}

                        <div className="employer-field">

                            <label htmlFor="industry">
                                Industry
                            </label>

                            <input
                                id="industry"
                                name="industry"
                                type="text"
                                value={
                                    form.industry
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Manpower"
                            />

                        </div>

                        {/* Company Type */}

                        <div className="employer-field">

                            <label htmlFor="companyType">
                                Company Type
                            </label>

                            <input
                                id="companyType"
                                name="companyType"
                                type="text"
                                value={
                                    form.companyType
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Recruitment Agency"
                            />

                        </div>

                        {/* Address */}

                        <div className="employer-field employer-field-full">

                            <label htmlFor="address">
                                Address
                            </label>

                            <textarea
                                id="address"
                                name="address"
                                value={
                                    form.address
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Kathmandu, Nepal"
                                rows={3}
                            />

                        </div>

                        {/* Status */}

                        <div className="employer-field">

                            <label htmlFor="status">
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={
                                    form.status
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="PENDING">
                                    Pending
                                </option>

                                <option value="ACTIVE">
                                    Active
                                </option>

                                <option value="INACTIVE">
                                    Inactive
                                </option>

                            </select>

                        </div>

                        {/* Form Actions */}

                        <div className="employer-form-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={
                                    handleCloseForm
                                }
                                disabled={
                                    submitting ||
                                    updating
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={
                                    submitting ||
                                    updating
                                }
                            >

                                {editingEmployer
                                    ? updating
                                        ? "Updating..."
                                        : "Update Employer"
                                    : submitting
                                        ? "Creating..."
                                        : "Create Employer"}

                            </button>

                        </div>

                    </form>

                </section>

            )}

            {/* ========================================
                SEARCH AND FILTERS
            ======================================== */}

            <section className="employer-filters">

                {/* SEARCH */}

                <div className="employer-search">

                    <label htmlFor="employer-search">
                        Search Employers
                    </label>

                    <input
                        id="employer-search"
                        type="text"
                        placeholder="Search company, contact, email or phone..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                </div>

                {/* STATUS */}

                <div className="employer-status-filter">

                    <label htmlFor="employer-status-filter">
                        Status
                    </label>

                    <select
                        id="employer-status-filter"
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                    >
                        <option value="">
                            All Statuses
                        </option>

                        <option value="PENDING">
                            Pending
                        </option>

                        <option value="ACTIVE">
                            Active
                        </option>

                        <option value="INACTIVE">
                            Inactive
                        </option>
                    </select>

                </div>

                {/* CLEAR */}

                {(search || statusFilter) && (

                    <button
                        type="button"
                        className="btn btn-secondary employer-clear-filter"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </button>

                )}

            </section>


            {/* ========================================
                EMPLOYER LIST
            ======================================== */}

            <section className="card employers-list-panel">

                <div className="employers-panel-header">

                    <div>

                        <h2>
                            Registered Employers
                        </h2>

                        <p>
                            {filteredEmployers.length} employer
                            {filteredEmployers.length !== 1
                                ? "s"
                                : ""}{" "}
                            found.
                        </p>

                    </div>

                </div>

                {/* ========================================
                    EMPTY STATE
                ======================================== */}

                {filteredEmployers.length === 0 ? (

                    <div className="employer-empty-state">

                        <h3>
                            No Employers Found
                        </h3>

                        <p>
                            {employers.length === 0
                                ? "No employers have been registered yet."
                                : "No employers match your current search or filter."}
                        </p>

                        {employers.length === 0 && (

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={
                                    handleOpenForm
                                }
                            >
                                Add First Employer
                            </button>

                        )}

                    </div>

                ) : (

                    <div className="employers-table-wrapper">

                        <table className="employers-table">

                            <thead>

                                <tr>

                                    <th>
                                        Company
                                    </th>

                                    <th>
                                        Contact
                                    </th>

                                    <th>
                                        Location
                                    </th>

                                    <th>
                                        Industry
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredEmployers.map(
                                    (employer) => (

                                        <tr
                                            key={
                                                employer.id
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        employer.companyName
                                                    }
                                                </strong>

                                                <span className="employer-id">
                                                    ID #
                                                    {
                                                        employer.id
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        employer.contactPerson ||
                                                        "—"
                                                    }
                                                </strong>

                                                <span className="employer-secondary">

                                                    {
                                                        employer.email ||
                                                        employer.phone ||
                                                        "No contact information"
                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                <strong>
                                                    {
                                                        employer.city ||
                                                        "—"
                                                    }
                                                </strong>

                                                <span className="employer-secondary">
                                                    {
                                                        employer.country ||
                                                        "—"
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {
                                                    employer.industry ||
                                                    "—"
                                                }
                                            </td>

                                            <td>

                                                <span
                                                    className={`employer-status employer-status-${employer.status.toLowerCase()}`}
                                                >
                                                    {
                                                        employer.status
                                                    }
                                                </span>

                                            </td>

                                            <td>

                                                <div className="employer-actions">

                                                    <button
                                                        type="button"
                                                        className="employer-action-btn"
                                                        onClick={() =>
                                                            handleViewEmployer(
                                                                employer.id
                                                            )
                                                        }
                                                        disabled={
                                                            viewLoading
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="employer-action-btn"
                                                        onClick={() =>
                                                            handleEditEmployer(
                                                                employer
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="employer-action-btn employer-delete-btn"
                                                        onClick={() =>
                                                            handleDeleteEmployer(
                                                                employer.id
                                                            )
                                                        }
                                                        disabled={
                                                            deletingId ===
                                                            employer.id
                                                        }
                                                    >
                                                        {deletingId ===
                                                            employer.id
                                                            ? "Deleting..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>

            {/* ========================================
                VIEW EMPLOYER MODAL
            ======================================== */}

            {viewingEmployer && (

                <div
                    className="employer-modal-overlay"
                    onClick={() =>
                        setViewingEmployer(null)
                    }
                >

                    <div
                        className="employer-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="employer-modal-header">

                            <div>

                                <span className="employers-eyebrow">
                                    EMPLOYER DETAILS
                                </span>

                                <h2>
                                    {
                                        viewingEmployer.companyName
                                    }
                                </h2>

                            </div>

                            <button
                                type="button"
                                className="employer-modal-close"
                                onClick={() =>
                                    setViewingEmployer(
                                        null
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="employer-details-grid">

                            <div>
                                <span>
                                    Company Name
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.companyName
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Contact Person
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.contactPerson ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Email
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.email ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Phone
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.phone ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Country
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.country ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    City
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.city ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Industry
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.industry ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Company Type
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.companyType ||
                                        "—"
                                    }
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Status
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.status
                                    }
                                </strong>
                            </div>

                            <div className="employer-detail-full">

                                <span>
                                    Address
                                </span>

                                <strong>
                                    {
                                        viewingEmployer.address ||
                                        "—"
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Employer ID
                                </span>

                                <strong>
                                    #
                                    {
                                        viewingEmployer.id
                                    }
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Created By
                                </span>

                                <strong>
                                    User #
                                    {
                                        viewingEmployer.createdById
                                    }
                                </strong>

                            </div>

                        </div>

                        <div className="employer-modal-actions">

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    setViewingEmployer(
                                        null
                                    )
                                }
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() =>
                                    handleEditEmployer(
                                        viewingEmployer
                                    )
                                }
                            >
                                Edit Employer
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Employers;