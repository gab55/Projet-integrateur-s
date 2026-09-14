import { StyleSheet, Dimensions } from 'react-native';


export const COLORS = {
    primary: '#0A1159',
    secondary: '#CED8E0',
    background: '#EAF0F3',
    darktext: '#1C1C1E',
    lightText: '#FDFFFE',
    white: '#FFFFFF',
    contrast: '#F48204',
    blueContrast: '#51A7DC',
    redAlert: '#D30D0D',
    greenAlert: '#48CC41',
    yellowAlert: '#E5C824',

};

export const globalStyles = StyleSheet.create({
    // Layout Templates
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
    },
    contentContainer: {
        flex: 1,
        marginTop: 10,
        justifyContent: 'flex-start',
        alignContent: "flex-start"
    },
    infoContainer: {
        flex: 1,
        marginTop: 20,
        width: '100%',

    },
    scrollContainer: {
        paddingBottom: 30,
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: 0,
        paddingHorizontal: 25,
        alignSelf: 'stretch',
    },
    inlineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 4,

    },
    listItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
        backgroundColor: '#fff',
    },
    columnContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        minWidth: Dimensions.get('window').width * 0.4,
        height: 'auto',
        alignSelf: 'stretch',
        // Shadow template for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // Shadow template for Android
        elevation: 3,
    },
    modal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
    },

    listPadding: {
        paddingBottom: 20
    },
    horizontalScrollPadding: {
        paddingHorizontal: 16,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%'
    },
    statusColumn: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
        minWidth: 60
    },
    infoColumn: {
        flex: 1,
        justifyContent: 'center'
    },

    // Typography Templates
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.darktext,
        marginBottom: 8,

    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
        fontFamily: 'inter',
        color: COLORS.darktext,
        lineHeight: 22,

    },
    caption: {
        fontSize: 12,
        fontWeight: '200',
        fontFamily: 'inter',
        color: COLORS.darktext,
    },
    Header1: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'intel',
        color: COLORS.darktext,
        lineHeight: 40,

    },
    Header2: {
        fontSize: 26,
        fontWeight: '700',
        fontFamily: 'intel',
        color: COLORS.darktext,
        lineHeight: 36,
    },
    Header3: {
        fontSize: 20,
        fontWeight: '500',
        fontFamily: 'intel',
        color: COLORS.darktext,
        lineHeight: 30,
    },

    DropShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },


    // Interactive Component Templates
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        marginTop: "auto",
    },
    textbutton: {
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,

    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    tabIcon: {
        width: 36,
        height: 36,
    },
    textInput: {
        borderWidth: 1,
        borderColor: COLORS.secondary,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
    },
});