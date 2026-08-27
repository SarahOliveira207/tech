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
import * as Location from 'expo-location';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, ALUNO_ID } from '../firebase/config';


export default function NewCallScreen() {
    const [description, setDescription] = useState('');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [saving, setSaving] = useState(false);

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
    };

    async function handleGetLocation(){
        const permission = await Location.requestForegroundPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão negada', 'Precisaos de localização para chek-in.');
            return;
        }

        setLoadingLocation(true);

        try {
            const gpsAtivo = await Location.hasServicesEnabledAsync();
            if (!gpsAtivo) {
                Alert.alert('GPS desativado', 'Ative o GPS para continuar.');
                return;
            }
            const position = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Balanced});

            const [local] = await Location.reverseGeocodeAsync({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });

            if (local) {
                const enderecoFormatado = `${local.street && 'Endereço nao identificado'}, ${local.city ?? ''} - ${local.region ?? ''}`;
                setAddress(enderecoFormatado);
            } else {
                setAddress('Endereço não identificado');
            }
        }catch (error) {
            Alert.alert('Erro', 'Não foi possível obter a localização.');
        } finally {
            setLoadingLocation(false);
        }
    };

    async function handleCreateCall() {
        setSaving(true);
        
        try {
            await addDoc(collection(db, 'alunos', ALUNO_ID, 'chamados'), {
            description,
            photoUri,
            address,
            status: 'aberto',
            criadoEm: serverTimestamp(),
            });
        
            Alert.alert('Sucesso', 'Chamado registrado!');
            setDescription('');
            setPhotoUri(null);
            setAddress(null);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o chamado. Tente novamente.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Novo Chamado</Text>
            <Text style={styles.label}>Descrição do problema</Text>
            <TextInput
                style={styles.input}
                placeholder="Ex.: Notebook não liga..."
                value={description}
                onChangeText={setDescription}
                multiline> sla</TextInput>
        
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
                <Text style={styles.placeholderText}>Nenhuma foto anexada</Text>
            </View>
        )}

        <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Tirar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={handleTakePhoto}>
                <Text style={styles.buttonText}>Escolher da Galeria</Text>
            </TouchableOpacity>
        </View>

    
        <TouchableOpacity
            style={[styles.button, styles.confirmButton, (!description || saving) && styles.disabledButton]}
            disabled={!description || saving}
            onPress={handleCreateCall}
            >
            <Text style={styles.buttonText}>{saving ? 'Salvando...' : 'Criar Chamado'}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Localização do chamado</Text>
 
        {loadingLocation ? (
            <Text style={styles.placeholderText}>Buscando localização...</Text>
        ) : address ? (
         <Text style={styles.addressText}>{address}</Text>
        ) : (
         <Text style={styles.placeholderText}>Nenhuma localização registrada</Text>
        )}
        
        <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={handleGetLocation}
            disabled={loadingLocation}
        >
        <Text style={styles.buttonText}>
            {loadingLocation ? 'Buscando...' : 'Registrar localização'}
        </Text>
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
    placeholderText: {color: '#888', fontSize: 16},
    buttonRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 20},
    button: {flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5},
    cameraButton: {backgroundColor: '#4CAF50'},
    galleryButton: {backgroundColor: '#2196F3'},    
    removeButton: {backgroundColor: '#f44336', padding: 10, borderRadius: 8, marginTop: 10, alignItems: 'center'},
    removeButtonText: {color: '#fff', fontWeight: 'bold'},
    confirmButton: {backgroundColor: '#FF9800', marginTop: 30},
    disabledButton: {backgroundColor: '#ccc'},
    buttonText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
    addressText: { fontSize: 14, color: '#333', marginBottom: 8 },
    locationButton: { backgroundColor: '#00695c', marginBottom: 16 },

})
        

