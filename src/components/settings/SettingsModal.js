"use client";

import { FiX, FiArrowLeft, FiSend, FiTrash2 } from "react-icons/fi";
import styles from "@/app/page.module.css";
import { useToast } from "@/components/toast/toastProvider";
import Image from "next/image";
import { useState, useRef } from "react";

export default function SettingsModal({ onClose, setting: initialSetting }) {
  const { addToast } = useToast();
  const [setting, setSetting] = useState(initialSetting);
  const [previousSetting, setPreviousSetting] = useState(null);

  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportForm, setSupportForm] = useState({
    subject: "",
    message: "",
    category: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleBackClick = () => {
    if (previousSetting) {
      setSetting(previousSetting);
      setPreviousSetting(null);
    } else {
      onClose();
    }
  };

  const navigateTo = (newSetting) => {
    setPreviousSetting(setting);
    setSetting(newSetting);
  };

  const handleSupportFormChange = (e) => {
    const { name, value } = e.target;
    setSupportForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast("Ukuran file terlalu besar. Maksimum 5MB.", "error", 5000);
        e.target.value = "";
        return;
      }

      // Store the file
      setSelectedFile(file);

      // Create a preview URL
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("subject", supportForm.subject);
      formData.append("message", supportForm.message);
      formData.append("category", supportForm.category);

      const userName = localStorage.getItem("userName");
      const userEmail = localStorage.getItem("userEmail");

      if (userName) formData.append("name", userName);
      if (userEmail) formData.append("email", userEmail);

      if (selectedFile) {
        formData.append("attachment", selectedFile);
      }

      // Start sending the form data in the background
      fetch(`http://localhost:5000/api/support/submit`, {
        method: "POST",
        body: formData,
        credentials: "include",
      }).catch((error) => {
        console.log(
          "Network error occurred, but ticket might still be processed:",
          error
        );
      });

      // Add a deliberate delay to simulate processing time (2.5 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Show success message after the delay
      addToast(
        "Tiket dukungan dikirim! Kami akan segera menghubungi Anda.",
        "success",
        3000
      );

      // Reset the form
      setSupportForm({
        subject: "",
        message: "",
        category: "general",
      });

      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowSupportForm(false);
    } catch (error) {
      console.error("Error preparing support ticket:", error);
      addToast(
        `Terjadi kesalahan saat menyiapkan tiket dukungan. Silakan coba lagi.`,
        "error",
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (setting) {
      case "help":
        return (
          <>
            <h2>Bantuan & Dukungan</h2>
            <div className={styles.settingsContent}>
              {!showSupportForm ? (
                <>
                  <h3>Hubungi Kami</h3>
                  <p>Email: spendlymail@gmail.com</p>
                  <p>Telepon: +62 858-2345-9380</p>

                  <h3>FAQ</h3>
                  <div className={styles.faqItem}>
                    <h4>Bagaimana cara menambahkan transaksi?</h4>
                    <p>
                      Buka Dompet dan tekan tombol + untuk menambahkan transaksi
                      baru.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Bisakah saya mengekspor data pengeluaran saya?</h4>
                    <p>
                      Ya! Buka Dashboard, tekan ikon menu dan pilih &quot;Ekspor
                      Data&quot;.
                    </p>
                  </div>
                  <div className={styles.faqItem}>
                    <h4>Bagaimana cara mengubah profil saya?</h4>
                    <p>
                      Di halaman Profil, tekan &quot;Edit Profil&quot; dan ubah
                      nama lalu tekan save changes.
                    </p>
                  </div>

                  <button
                    className={styles.supportButton}
                    onClick={() => setShowSupportForm(true)}
                  >
                    Buat Support Ticket
                  </button>
                </>
              ) : (
                <div className={styles.supportFormContainer}>
                  <button
                    className={styles.backToHelp}
                    onClick={() => setShowSupportForm(false)}
                  >
                    <FiArrowLeft size={16} /> Kembali ke Bantuan
                  </button>

                  <h3>Kirim Support Ticket</h3>
                  <p className={styles.supportFormIntro}>
                    Mohon isi formulir di bawah ini dan tim dukungan kami akan
                    segera menghubungi Anda.
                  </p>

                  <form
                    onSubmit={handleSupportSubmit}
                    className={styles.supportForm}
                  >
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Kategori</label>
                      <select
                        id="category"
                        name="category"
                        value={supportForm.category}
                        onChange={handleSupportFormChange}
                        required
                        className={styles.formSelect}
                      >
                        <option value="general">Pertanyaan Umum</option>
                        <option value="account">Masalah Akun</option>
                        <option value="transaction">Masalah Transaksi</option>
                        <option value="bug">Laporan Bug</option>
                        <option value="feature">Permintaan Fitur</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="subject">Subjek</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="Deskripsi singkat masalah Anda"
                        value={supportForm.subject}
                        onChange={handleSupportFormChange}
                        required
                        className={styles.formInput}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="message">Pesan</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Mohon berikan detail tentang masalah Anda"
                        value={supportForm.message}
                        onChange={handleSupportFormChange}
                        required
                        rows={5}
                        className={styles.formTextarea}
                      />
                    </div>

                    <div className={styles.formAttachment}>
                      {previewUrl ? (
                        <div className={styles.imagePreviewContainer}>
                          <div className={styles.imagePreviewWrapper}>
                            <Image
                              src={previewUrl}
                              alt="Preview"
                              className={styles.imagePreview}
                              width={300}
                              height={200}
                              layout="responsive"
                              objectFit="contain"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className={styles.removeImageBtn}
                              title="Hapus gambar"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                          <p className={styles.fileInfo}>
                            {selectedFile?.name} (
                            {Math.round(selectedFile?.size / 1024)} KB)
                          </p>
                        </div>
                      ) : (
                        <label className={styles.attachmentLabel}>
                          <input
                            type="file"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            accept="image/*"
                          />
                          <span>+ Tambahkan Screenshot (opsional)</span>
                        </label>
                      )}
                      <p className={styles.fileHint}>Ukuran file maks: 5MB</p>
                    </div>

                    <button
                      type="submit"
                      className={styles.submitSupportButton}
                      disabled={isSubmitting}
                    >
                      <FiSend size={18} />
                      {isSubmitting ? "Mengirim..." : "Kirim Ticket"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </>
        );

      case "about":
        return (
          <>
            <h2>Tentang Spend.ly</h2>
            <div className={styles.settingsContent}>
              <div className={styles.appLogoContainer}>
                <div className={styles.appLogoWrapper}>
                  <Image
                    src="/logo.svg"
                    width={36}
                    height={36}
                    alt="Logo Spend.ly"
                    className={styles.appLogo}
                  />
                </div>
                <h3>Spend.ly</h3>
              </div>

              <p className={styles.appVersion}>Versi 1.0.0</p>
              <p className={styles.appDescription}>
                Spend.ly membantu Anda melacak pengeluaran dan pendapatan harian
                dengan desain interface yang sederhana dan elegan. Tetapkan
                anggaran, kategorikan transaksi, dan dapatkan wawasan tentang
                kebiasaan belanja Anda untuk membuat keputusan keuangan yang
                lebih baik.
              </p>

              <h3>Tim Pengembang</h3>
              <ul className={styles.teamList}>
                <li>I Kadek Tresna Jeverly - Full-stack</li>
                <li>Arturito Imanuel Rawung - Backend</li>
                <li>Revando Aruperes - Fullstack</li>
                <li>Ricky Mambu - PR</li>
              </ul>

              <div className={styles.legalInfo}>
                <p>&copy; 2025 Spend.ly - All rights reserved.</p>
                <div className={styles.legalLinks}>
                  <button
                    onClick={() => navigateTo("terms")}
                    className={styles.legalLink}
                  >
                    Syarat Layanan
                  </button>
                  <button
                    onClick={() => navigateTo("privacy")}
                    className={styles.legalLink}
                  >
                    Kebijakan Privasi
                  </button>
                </div>
              </div>
            </div>
          </>
        );

      case "terms":
        return (
          <>
            <div className={styles.settingsHeader}>
              <button className={styles.backButton} onClick={handleBackClick}>
                <FiArrowLeft size={20} />
              </button>
              <h2>Syarat Layanan</h2>
            </div>
            <div className={`${styles.settingsContent} ${styles.legalContent}`}>
              <p className={styles.lastUpdated}>
                Terakhir Diperbarui: 25 April 2025
              </p>

              <h3>1. Penerimaan Ketentuan</h3>
              <p>
                Dengan mengakses atau menggunakan Spend.ly, Anda setuju untuk
                terikat dengan Syarat Layanan ini dan semua hukum dan peraturan
                yang berlaku. Jika Anda tidak setuju dengan ketentuan ini, Anda
                dilarang menggunakan atau mengakses Spend.ly.
              </p>

              <h3>2. Lisensi Penggunaan</h3>
              <p>
                Izin diberikan untuk sementara menggunakan Spend.ly untuk
                manajemen keuangan pribadi, non-komersial. Ini adalah pemberian
                lisensi, bukan pengalihan hak milik, dan di bawah lisensi ini
                Anda tidak boleh:
              </p>
              <ul>
                <li>Memodifikasi atau menyalin materi</li>
                <li>Menggunakan materi untuk tujuan komersial apa pun</li>
                <li>
                  Mencoba mendecompile atau merekayasa balik perangkat lunak apa
                  pun yang terdapat dalam Spend.ly
                </li>
                <li>
                  Menghapus hak cipta atau notasi kepemilikan lainnya dari
                  materi
                </li>
                <li>
                  Mentransfer materi ke orang lain atau &quot;mencerminkan&quot;
                  materi di server lain
                </li>
              </ul>

              <h3>3. Penafian</h3>
              <p>
                Materi di Spend.ly disediakan &apos;apa adanya&apos;. Spend.ly
                tidak memberikan jaminan, tersurat maupun tersirat, dan dengan
                ini menolak dan menegasikan semua jaminan lain termasuk, tanpa
                batasan, jaminan tersirat atau kondisi kelayakan untuk
                diperdagangkan, kesesuaian untuk tujuan tertentu, atau
                non-pelanggaran kekayaan intelektual atau pelanggaran hak
                lainnya.
              </p>

              <h3>4. Batasan</h3>
              <p>
                Dalam keadaan apa pun Spend.ly atau pemasoknya tidak bertanggung
                jawab atas kerusakan apa pun (termasuk, tanpa batasan, kerusakan
                karena kehilangan data atau keuntungan, atau karena gangguan
                bisnis) yang timbul dari penggunaan atau ketidakmampuan
                menggunakan Spend.ly, bahkan jika Spend.ly atau perwakilan resmi
                telah diberi tahu secara lisan atau tertulis tentang kemungkinan
                kerusakan tersebut.
              </p>

              <h3>5. Akurasi Materi</h3>
              <p>
                Materi yang muncul di Spend.ly bisa termasuk teknis, kesalahan
                tipografi, atau fotografi. Spend.ly tidak menjamin bahwa materi
                apa pun di situs webnya akurat, lengkap, atau terkini. Spend.ly
                dapat membuat perubahan pada materi yang terdapat di situs
                webnya kapan saja tanpa pemberitahuan.
              </p>

              <h3>6. Tautan</h3>
              <p></p>
              <h3>7. Modifikasi</h3>
              <p>
                Spend.ly dapat merevisi syarat layanan ini kapan saja tanpa
                pemberitahuan. Dengan menggunakan Spend.ly, Anda setuju untuk
                terikat dengan versi terbaru dari syarat layanan ini.
              </p>

              <h3>8. Hukum yang Mengatur</h3>
              <p>
                Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai
                dengan hukum [Negara Anda] dan Anda secara tidak dapat ditarik
                kembali tunduk pada yurisdiksi eksklusif pengadilan di lokasi
                tersebut.
              </p>
            </div>
          </>
        );

      case "privacy":
        return (
          <>
            <div className={styles.settingsHeader}>
              <button className={styles.backButton} onClick={handleBackClick}>
                <FiArrowLeft size={20} />
              </button>
              <h2>Kebijakan Privasi</h2>
            </div>
            <div className={`${styles.settingsContent} ${styles.legalContent}`}>
              <p className={styles.lastUpdated}>
                Terakhir Diperbarui: 25 April 2025
              </p>

              <h3>1. Pendahuluan</h3>
              <p>
                Di Spend.ly, kami menghormati privasi Anda dan berkomitmen untuk
                melindungi data pribadi Anda. Kebijakan Privasi ini akan memberi
                tahu Anda tentang bagaimana kami menjaga data pribadi Anda saat
                Anda menggunakan aplikasi kami dan memberi tahu Anda tentang hak
                privasi Anda.
              </p>

              <h3>2. Data yang Kami Kumpulkan</h3>
              <p>
                Kami dapat mengumpulkan, menggunakan, menyimpan, dan mentransfer
                berbagai jenis data pribadi tentang Anda termasuk:
              </p>
              <ul>
                <li>
                  <strong>Data Identitas</strong>: termasuk nama, nama pengguna,
                  atau pengenal serupa
                </li>
                <li>
                  <strong>Data Kontak</strong>: termasuk alamat email
                </li>
                <li>
                  <strong>Data Keuangan</strong>: termasuk data transaksi yang
                  Anda masukkan ke dalam aplikasi
                </li>
                <li>
                  <strong>Data Teknis</strong>: termasuk protokol internet (IP)
                  alamat, jenis dan versi browser, pengaturan zona waktu dan
                  lokasi, sistem operasi dan platform
                </li>
                <li>
                  <strong>Data Penggunaan</strong>: termasuk informasi tentang
                  bagaimana Anda menggunakan aplikasi kami
                </li>
              </ul>

              <h3>3. Bagaimana Kami Menggunakan Data Anda</h3>
              <p>Kami menggunakan data Anda untuk:</p>
              <ul>
                <li>Menyediakan dan mengelola akun Anda</li>
                <li>Menyediakan dan mengelola layanan yang Anda minta</li>
                <li>Mempersonalisasi dan meningkatkan pengalaman Anda</li>
                <li>Berkomunikasi dengan Anda tentang layanan kami</li>
                <li>Mematuhi kewajiban hukum</li>
              </ul>

              <h3>4. Keamanan Data</h3>
              <p>
                Kami telah menerapkan langkah-langkah keamanan yang sesuai untuk
                mencegah data pribadi Anda hilang secara tidak sengaja,
                digunakan atau diakses dengan cara yang tidak sah, diubah atau
                diungkapkan. Kami membatasi akses ke data pribadi Anda untuk
                karyawan, agen, kontraktor, dan pihak ketiga lainnya yang
                memiliki kebutuhan bisnis untuk mengetahui.
              </p>

              <h3>5. Penyimpanan Data</h3>
              <p>
                Kami hanya akan menyimpan data pribadi Anda selama diperlukan
                untuk memenuhi tujuan kami mengumpulkannya, termasuk untuk
                tujuan memenuhi persyaratan hukum, akuntansi, atau pelaporan.
              </p>

              <h3>6. Hak Hukum Anda</h3>
              <p>
                Dalam keadaan tertentu, Anda memiliki hak berdasarkan
                undang-undang perlindungan data sehubungan dengan data pribadi
                Anda termasuk:
              </p>
              <ul>
                <li>Meminta akses ke data pribadi Anda</li>
                <li>Meminta koreksi data pribadi Anda</li>
                <li>Meminta penghapusan data pribadi Anda</li>
                <li>Menolak pemrosesan data pribadi Anda</li>
                <li>Meminta pembatasan pemrosesan data pribadi Anda</li>
                <li>Meminta transfer data pribadi Anda</li>
                <li>Hak untuk menarik persetujuan</li>
              </ul>

              <h3>7. Tautan Pihak Ketiga</h3>
              <p>
                Aplikasi kami mungkin menyertakan tautan ke situs web pihak
                ketiga, plug-in, dan aplikasi. Mengklik tautan tersebut atau
                mengaktifkan koneksi tersebut dapat memungkinkan pihak ketiga
                untuk mengumpulkan atau berbagi data tentang Anda. Kami tidak
                mengontrol situs web pihak ketiga ini dan tidak bertanggung
                jawab atas pernyataan privasi mereka.
              </p>

              <h3>8. Perubahan pada Kebijakan Privasi</h3>
              <p>
                Kami dapat memperbarui Kebijakan Privasi kami dari waktu ke
                waktu. Kami akan memberi tahu Anda tentang perubahan apa pun
                dengan memposting Kebijakan Privasi baru di halaman ini dan
                memperbarui tanggal &quot;Terakhir Diperbarui&quot;.
              </p>

              <h3>9. Hubungi Kami</h3>
              <p>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini,
                silakan hubungi kami di privacy@spend.ly.
              </p>
            </div>
          </>
        );

      default:
        return <p>Pilih pengaturan untuk melihat detail</p>;
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div
        className={`${styles.modal} ${
          setting === "terms" || setting === "privacy" ? styles.legalModal : ""
        }`}
      >
        {!previousSetting && !showSupportForm && (
          <button className={styles.closeButton} onClick={onClose}>
            <FiX size={24} />
          </button>
        )}

        {renderContent()}
      </div>
    </div>
  );
}
