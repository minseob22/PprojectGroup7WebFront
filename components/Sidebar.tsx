"use client";

import { useState } from "react";
import styles from "./Sidebar.module.css";
import { UserPlus, Search } from "lucide-react";
import { Patient } from "@/types";

interface SidebarProps {
  patients: Patient[];
  activePatientId: number | null;
  onSelectPatient: (id: number) => void;
  onOpenModal: () => void;
}

export default function Sidebar({
  patients,
  activePatientId,
  onSelectPatient,
  onOpenModal,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <button className={styles.newPatientButton} onClick={onOpenModal}>
          <UserPlus size={18} /> 새 환자 등록
        </button>

        <div className={styles.searchWrapper}>
          <Search size={16} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="환자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.patientList}>
        {patients
          .filter((p) => p.name.includes(searchTerm))
          .map((p) => (
            <button
              key={p.id}
              onClick={() => onSelectPatient(p.id)}
              className={`${styles.patientItem} ${
                activePatientId === p.id ? styles.activePatient : ""
              }`}
            >
              <div className={styles.patientName}>{p.name}</div>
              <div className={styles.patientSub}>
                {p.birthDate} ({p.gender})
              </div>
            </button>
          ))}
      </div>
    </aside>
  );
}
