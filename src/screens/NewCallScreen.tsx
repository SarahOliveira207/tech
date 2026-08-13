import React, {useState} from "react";
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
}   from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function NewCallScreen() {
    const [description, setDescription] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    async function handleTakePhoto() {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
    
        if (!permission.granted) {
            Alert.alert('Permissão negada', 
                'Precisamos da câmera para o chamado');
                return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4,3],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Novo Chamado</Text>
            <Text style={styles.label}>Descrição do problema</Text>
            <Text Input
                style={styles.input}
                placeholder="Ex.: Notebook não liga..."
                value={description}
                onChangeText={setDescription}
                multuline
            />
        
        <Text style={styles.label}>Foto do equipamento</Text>

        {photoUri ? (
            <View>
                <Image source={{ uri: photoUri }} style={styles.photo} />
                <TouchableOpacity 
                    onPress={() => setPhotoUri(null)}
                    style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remover Foto</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Nenhuma foto anexada</Text>
            </View>
        )}

        <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={handlePickfromGallery}>
                <Text style={styles.buttonText}>Escolher da Galeria</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={[styles.button, styles.confirmButton, !description && styles.disabledButton]}
        disabled={!description}
        onPress={() => Alert.alert('Sucesso', 'Chamado enviado com sucesso!')}>
            <Text style={styles.buttonText}>Criar Chamado</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {flex:1, backgroundColor: '#f5f5f5'},
    content: {padding: 20, paddingBottom: 40},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
    label: {fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16},
    input: {borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16, backgroundColor: '#fff'},
    photo: {width: '100%', height: 200, borderRadius: 8, marginTop: 10},
    photoPlaceholder: {width: '100%', height: 200, borderRadius: 8, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginTop: 10},
    placeholder: {height: 160, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', marginTop: 10},
    photoPlaceholderText: {color: '#888', fontSize: 16},
    buttonRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 20},
    button: {flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5},
    cameraButton: {backgroundColor: '#4CAF50'},
    galleryButton: {backgroundColor: '#2196F3'},    
    removeButton: {backgroundColor: '#f44336', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center'},
    removeButtonText: {color: '#fff', fontWeight: 'bold'},
    confirmButton: {backgroundColor: '#FF9800', marginTop: 30},
    disabledButton: {backgroundColor: '#ccc'},
    buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
})
        

