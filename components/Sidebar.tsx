"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./Sidebar.module.css";
import { UserPlus, Search } from "lucide-react";
// 👇 [중요] registerPatient 함수를 import 해야 합니다!
import { fetchPatients, registerPatient } from "@/utils/api"; 
import { Patient } from "@/types";
import PatientModal from "./PatientModal";

export default function Sidebar() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  const activeId = params?.id ? Number(params.id) : null;

  // 초기 데이터 로드
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    fetchPatients()
      .then(setPatients)
      .catch(console.error);
  };

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <button
            className={styles.newPatientButton}
            onClick={() => setIsModalOpen(true)}
          >
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
              <Link
                key={p.id}
                href={`/patient/${p.id}`}
                className={`${styles.patientItem} ${
                  activeId === p.id ? styles.activePatient : ""
                }`}
              >
                <div className={styles.patientName}>{p.name}</div>
                <div className={styles.patientSub}>
                  {p.birthDate} ({p.gender})
                </div>
              </Link>
            ))}
        </div>
      </aside>

      {/* 모달 로직 수정 */}
      {isModalOpen && (
        <PatientModal
          onClose={() => setIsModalOpen(false)}
          // 👇 [핵심 수정] 여기서 API를 호출해야 합니다!
          onSubmit={async (formData) => {
            try {
              // 1. API 호출 (서버에 저장)
              const response = await registerPatient(formData);
              
              // 2. 모달 닫기
              setIsModalOpen(false);

              // 3. 목록 다시 불러오기 (즉시 갱신)
              loadPatients();

              // 4. (선택) 방금 등록한 환자 채팅방으로 바로 이동
              if (response && response.data && response.data.id) {
                router.push(`/patient/${response.data.id}`);
              }
              
            } catch (error) {
              console.error("환자 등록 실패:", error);
              alert("등록에 실패했습니다. 다시 시도해주세요.");
            }
          }}
        />
      )}
    </>
  );
}