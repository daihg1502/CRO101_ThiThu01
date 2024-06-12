import { Alert, Button, FlatList, Image, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'

const link_api = "http://10.24.5.82:3000/nhanVien";

const ManHinhHT = () => {

  const [dsNV, setDsNV] = useState([]); // state chứa danh sách Nhân viên

  //Khai báo state lưu trạng thái đóng mở dialog
  const [isShowDialog, setShowDialog] = useState(false)
  const [isShowDialogAdd, setShowDialogAdd] = useState(false)
  const [selectedNV, setSelectedNV] = useState(null); // state lưu thông tin của nhân viên được chọn
  const [isHoTen, setIsHoTen] = useState('')
  const [isGioiTinh, setIsGioiTinh] = useState('')
  const [isHopDongCT, setIsHopDongCT] = useState('')
  const [isHinhAnh, setIsHinhAnh] = useState('')

  const getList = async () => { // hàm lấy danh sách nhân viên
    try {
      let rs = await fetch(link_api); // đợi lấy nội dung từ server
      let arrNV = await rs.json(); // chuyển kết quả về dạng json
      // đến dòng dưới là không có lỗi
      // đổ dữ liệu vào state
      setDsNV(arrNV);


    } catch (error) {
      console.log(error);
    }
  }

  // Gọi hàm lấy danh sách sản phẩm khi màn hình được tải
  useEffect(() => {
    getList();
  }, []);



  // định nghĩa 1 component hiển thị dòng cho flatlist
  const RowNV = (props) => {

    const onPressItem = (nv) => {
      setSelectedNV(nv); // Cập nhật thông tin của nhân viên được chọn
      setShowDialog(true); // Mở modal dialog
    }

    const onPressDelete = (nv) => {
      Alert.alert(
        "Xác nhận xóa",
        `Bạn có chắc muốn xóa nhân viên ${nv.hoTen}?`,
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => deleteNV(nv)
          }
        ]
      );
    }

    const deleteNV = async (nv) => {
      try {
        // Gửi yêu cầu DELETE tới API để xóa nhân viên
        const response = await fetch(`${link_api}/${nv.id}`, {
          method: 'DELETE'
        });

        // Kiểm tra phản hồi từ API
        if (response.ok) {
          // Cập nhật danh sách nhân viên sau khi xóa thành công
          const updatedDsNV = dsNV.filter(item => item.id !== nv.id);
          setDsNV(updatedDsNV);
          setShowDialog(false); // Đóng modal dialog sau khi xóa thành công
        } else {
          console.error('Error deleting employee:', response.statusText);
        }
      } catch (error) {
        console.log(error);
      }
    }

    // { // thông tin 1 nv
    // console.log(props);
    return (
      <Pressable style={{ margin: 10, justifyContent: 'center', alignItems: "center", marginBottom: 20, borderWidth: 1, borderColor: 'black', borderRadius: 5, paddingTop: 10 }} onPress={() => { onPressItem(props.nv) }} >
        <Image source={{ uri: props.nv.hinhAnh }} style={styles.hinhAnh} />
        <View style={styles.viewThongTin}>
          <View style={styles.viewThongTin1}>
            <Text style={styles.text}>{props.nv.hoTen}</Text>
            <Text style={styles.text}>{props.nv.hopDongCT ? "Chính thức" : "Thử việc"}</Text>
          </View>
          <View>
            <Text style={styles.text}>{props.nv.gioiTinh}</Text>
            <Pressable onPress={() => onPressDelete(props.nv)}>
              <Image source={require('./ic_delete.png')} style={{ width: 50, height: 50 }} />
            </Pressable>
          </View>
        </View>
      </Pressable>
    )
  }

  const toggleAddDialog = () => {
    setShowDialogAdd(!isShowDialogAdd);
  }

  const addNV = async () => {
    try {
      // Tạo đối tượng nhân viên mới
      const newNV = {
        id: dsNV.length + 1,
        hoTen: isHoTen,
        gioiTinh: isGioiTinh,
        hopDongCT: isHopDongCT,
        hinhAnh: isHinhAnh
      };

      // Gửi yêu cầu POST đến API để thêm nhân viên mới
      const response = await fetch(link_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newNV)
      });

      // Kiểm tra phản hồi từ API
      if (response.ok) {
        // Cập nhật danh sách nhân viên sau khi thêm thành công
        getList();
        setShowDialogAdd(false); // Đóng modal dialog sau khi thêm thành công
      } else {
        console.error('Error adding new employee:', response.statusText);
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 10, marginBottom: 15 }}>DANH SÁCH NHÂN VIÊN</Text>
      <FlatList
        data={dsNV}
        renderItem={({ item }) => <RowNV nv={item} />}
        keyExtractor={item => item.id}
      />
      <Modal visible={isShowDialog}
        transparent={true}>
        <View style={styles.khungDialog}>
          <View style={styles.noiDungDialog}>
            {/* Khu vực này viết nội dung cho Dialog */}
            {selectedNV && (
              <View>
                <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 15 }}>THÔNG TIN NHÂN VIÊN</Text>
                <Image source={{ uri: selectedNV.hinhAnh }} style={styles.hinhAnh} />
                <Text style={styles.text}>Họ tên: {selectedNV.hoTen}</Text>
                <Text style={styles.text}>Giới tính: {selectedNV.gioiTinh}</Text>
                <Text style={{ marginBottom: 20 }}>Nhân viên {selectedNV.hopDongCT ? 'Chính thức' : 'Thử việc'}</Text>
                <Button title='Close' onPress={() => setShowDialog(false)} />
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Pressable onPress={toggleAddDialog} style={{ alignSelf: 'flex-end', width: 90, position: 'absolute', bottom: 0 }}>
        <Image source={require('./person_add_24dp.png')} style={{ width: 70, height: 70, alignSelf: 'flex-end', marginBottom: 20, margin: 20 }} />
      </Pressable>

      <Modal visible={isShowDialogAdd} transparent={true}>
        <View style={styles.khungDialog}>
          <View style={styles.noiDungDialog}>
            {/* Khu vực này viết nội dung cho Dialog thêm nhân viên */}
            <Text style={{ fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>THÊM NHÂN VIÊN</Text>
            <TextInput
              placeholder='Nhập họ tên '
              onChangeText={(txt) => { setIsHoTen(txt) }}
              style={styles.input} />
            <TextInput
              placeholder='Nhập giới tính '
              onChangeText={(txt) => { setIsGioiTinh(txt) }}
              style={styles.input} />
            <TextInput
              placeholder='Nhập hợp đồng '
              onChangeText={(txt) => {
                const hopDong = txt.toLowerCase().replace(/\s/g, '') === "chinhthuc" ? true : false;
                setIsHopDongCT(hopDong);
              }}
              style={styles.input} />
            <TextInput
              placeholder='Nhập URL hình ảnh '
              onChangeText={(txt) => { setIsHinhAnh(txt) }}
              style={styles.input} />

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

              <Pressable style={styles.bt_dialog_add} onPress={addNV}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Thêm</Text>
              </Pressable>
              <Pressable onPress={toggleAddDialog} style={styles.bt_dialog_add}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Đóng</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ManHinhHT

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  hinhAnh: {
    width: 150,
    height: 150,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 5
  },
  viewThongTin: {
    flexDirection: 'row'
  },
  viewThongTin1: {
    marginRight: 30
  },
  text: {
    marginBottom: 7,
    fontSize: 22,
    fontWeight: 'bold'
  },
  khungDialog: {
    flex: 1, // phần xám của dialog cho full màn hình
    justifyContent: 'center',// dóng giữa theo chiều dọc
    alignItems: 'center',// dóng giữa theo chiều ngang
    backgroundColor: 'rgba(0,0,0,0.7)'// màu nền cho khung
    // màu cho khung thì dùng opacity là 0.7 ở trên
  },
  noiDungDialog: {
    backgroundColor: 'white',
    width: 400, // kích thước phần sáng
    padding: 10,
    borderRadius: 10,
    opacity: 1,
    alignItems: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: 'blacks',
    borderRadius: 10,
    marginBottom: 10,
    width: '90%'
  },
  bt_dialog_add: {
    width: '30%',
    height: 30,
    borderRadius: 10,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20
  }

})