"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 [수정 1] next/router -> next/navigation
import styles from "./Sidebar.module.css";
import { UserPlus, Search } from "lucide-react";
import { Patient } from "@/types";

interface SidebarProps {
  patients: Patient[];
  activePatientId: number | null;
  // onSelectPatient는 URL 이동으로 대체하므로 제거해도 되지만, 
  // 기존 코드 호환성을 위해 남겨둔다면 선택적(?)으로 처리
  onSelectPatient?: (id: number) => void; 
  onOpenModal: () => void;
}

export default function Sidebar({
  patients,
  activePatientId,
  onOpenModal,
}: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSelectPatient = (id: number) => {
    router.push(`/patient/${id}`);
  };

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
              onClick={() => handleSelectPatient(p.id)}
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