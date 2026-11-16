import React from "react";
import { 
  Modal, 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity 
} from "react-native";

export default function ModalPopup({ visible, data, CloseModal, onConfirm }) {
  if (!data) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={CloseModal}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalIndicator} />
          
          <Text style={styles.modalTitle}>Konfirmasi Catatan AI 📝</Text>
          
          <View style={styles.previewCard}>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Keterangan</Text>
              <Text style={styles.previewValue}>{data.deskripsi}</Text>
            </View>
            
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Nominal</Text>
              <Text style={[styles.previewValue, styles.amountText]}>
                Rp {Number(data.nominal).toLocaleString("id-ID")}
              </Text>
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Sumber Dana</Text>
              <View style={[
                styles.typeBadge, 
                data.type === "makan" ? styles.badgeMakan : styles.badgeTabungan
              ]}>
                <Text style={styles.typeBadgeText}>
                  {data.type?.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Waktu</Text>
              <Text style={styles.previewValue}>
                {data.tanggal} • {data.jam}
              </Text>
            </View>
          </View>

          <View style={styles.modalActionRow}>
            <TouchableOpacity 
              style={styles.cancelBtn} 
              onPress={CloseModal}
            >
              <Text style={styles.cancelBtnText}>Batal</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.confirmBtn} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>Simpan Transaksi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    paddingBottom: 40,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#EEE',
    marginBottom: 25,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewLabel: {
    fontSize: 13,
    color: '#888',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  amountText: {
    color: '#34A853',
    fontSize: 16,
    fontWeight: 'bold',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeMakan: {
    backgroundColor: '#FFF4E5',
  },
  badgeTabungan: {
    backgroundColor: '#E6F4EA',
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 0.45,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: 'bold',
  },
  confirmBtn: {
    flex: 0.5,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#34A853',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
