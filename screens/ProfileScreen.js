import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native"
import InputForm from "../components/Form";
import { Checkbox, Button } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker";
import UserAvatar from './AvatarScreen';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    checkboxLabel: {
        textAlign: 'left',
        fontSize: 14
    },
    inputForm: {
        marginVertical: 12
    },
    buttonSaveContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'space-around'
    },
    avatarContainer: {
        flexDirection: 'row',
        marginVertical: 12,
        alignItems: 'center'
    },
    buttonChangeAvatar: {
        marginHorizontal: 12
    }
});

export default ProfileScreen = () => {
    const { signOut } = useContext(AuthContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [orderStatusesChecked, setOrderStatusesChecked] = useState(false);
    const [passwordChangedChecked, setPasswordChangedChecked] = useState(false);
    const [specialOffersChecked, setSpecialOffersChecked] = useState(false);
    const [newsletterChecked, setNewsletterChecked] = useState(false);
    const [avatarUri, setAvatarUri] = useState("");
    const [saveLoading, setSaveLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const getProfile = async () => {
        setProfileLoading(true);
        let profile = await AsyncStorage.multiGet(['avatar', 'name', 'email', 'phone', 'orderStatusesChecked', 'passwordChangedChecked', 'specialOffersChecked', 'newsletterChecked']);
        setAvatarUri(profile[0][1]);
        let name = profile[1][1];
        let splitName = name.split(' ');
        setFirstName(splitName.slice(0, 1).join(' '));
        setLastName(splitName.slice(1).join(' '));
        let email = profile[2][1];
        setEmail(email);
        let phoneNumber = profile[3][1];
        setPhone(phoneNumber);
        let orderStatusesChecked = JSON.parse(profile[4][1]);
        setOrderStatusesChecked(orderStatusesChecked ?? false);
        let passwordChangedChecked = JSON.parse(profile[5][1]);
        setPasswordChangedChecked(passwordChangedChecked ?? false);
        let specialOffersChecked = JSON.parse(profile[6][1]);
        setSpecialOffersChecked(specialOffersChecked ?? false);
        let newsletterChecked = JSON.parse(profile[7][1]);
        setNewsletterChecked(newsletterChecked ?? false);
        setProfileLoading(false);
    }
    const changeAvatar = async () => {
        let result = await launchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            selectionLimit: 1
        });
        let image = result.assets.at(0).uri;
        setAvatarUri(image);
    }
    const saveChanges = async () => {
        setSaveLoading(true);
        await AsyncStorage.multiSet([
            ['avatar', avatarUri ?? ""],
            ['name', `${firstName ?? ""} ${lastName ?? ""}`],
            ['email', email ?? ""],
            ['phone', phone ?? ""],
            ['orderStatusesChecked', JSON.stringify(orderStatusesChecked) ?? 'false'],
            ['passwordChangedChecked', JSON.stringify(passwordChangedChecked) ?? 'false'], 
            ['specialOffersChecked', JSON.stringify(specialOffersChecked) ?? 'false'], 
            ['newsletterChecked', JSON.stringify(newsletterChecked) ?? 'false']
        ]);
        setSaveLoading(false);
    }
    useEffect(getProfile, []);
    if (profileLoading) {
        return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator animating/>
        </View>
    }
    return <ScrollView>
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.avatarContainer}>
                <UserAvatar/>
                <Button mode="elevated" buttonColor="rgb(64, 84, 77)" textColor="white" style={styles.buttonChangeAvatar} onPress={() => {
                    changeAvatar();
                }}>
                    Change
                </Button>
                <Button mode="outlined" onPress={() => setAvatarUri("")}>
                    Remove
                </Button>
            </View>
            <InputForm title={"First name"} style={styles.inputForm} text={firstName} onChangeText={setFirstName}/>
            <InputForm title={"Last name"} style={styles.inputForm} text={lastName} onChangeText={setLastName}/>
            <InputForm title={"Email"} style={styles.inputForm} text={email} onChangeText={setEmail}/>
            <InputForm title={"Phone number"} style={styles.inputForm} text={phone} onChangeText={setPhone}/>
            <Text style={styles.sectionTitle}>Email notifications</Text>
            <Checkbox.Item 
                status={orderStatusesChecked ? "checked" : 'unchecked'} 
                mode="android" 
                position="leading" 
                label="Order statuses" 
                labelStyle={styles.checkboxLabel}
                color="rgb(64, 84, 77)"
                onPress={() => setOrderStatusesChecked(!orderStatusesChecked)}
            />
            <Checkbox.Item 
                status={passwordChangedChecked ? "checked" : 'unchecked'}
                mode="android" 
                position="leading" 
                label="Password changes" 
                labelStyle={styles.checkboxLabel}
                color="rgb(64, 84, 77)"
                onPress={() => setPasswordChangedChecked(!passwordChangedChecked)}
            />
            <Checkbox.Item 
                status={specialOffersChecked ? "checked" : 'unchecked'}
                mode="android" 
                position="leading" 
                label="Special offers" 
                labelStyle={styles.checkboxLabel}
                color="rgb(64, 84, 77)"
                onPress={() => setSpecialOffersChecked(!specialOffersChecked)}
            />
            <Checkbox.Item 
                status={newsletterChecked ? "checked" : 'unchecked'}
                mode="android" 
                position="leading" 
                label="Newsletter" 
                labelStyle={styles.checkboxLabel}
                color="rgb(64, 84, 77)"
                onPress={() => setNewsletterChecked(!newsletterChecked)}
            />
            <Button 
                buttonColor="rgb(243, 199, 61)" 
                textColor="rgb(0, 0, 0)" 
                mode="text" 
                onPress={() => {
                    signOut();
                }}>
                Log out
            </Button>
            <View style={styles.buttonSaveContainer}>
                <Button mode="outlined" onPress={getProfile}>
                    Discard changes
                </Button>
                <Button mode="elevated" buttonColor="rgb(64, 84, 77)" textColor="white" onPress={() => {
                    saveChanges();
                }} loading={saveLoading}>
                    Save changes
                </Button>
            </View>
        </View>
    </ScrollView>
}