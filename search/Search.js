import React, { useEffect, useState } from 'react'
import {
    StyleSheet,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native';

import filter from "lodash.filter";

const API_ENDPOINT = `https://portfolio-molindu-1.000webhostapp.com/product.json`;
// const API_ENDPOINT = [
//     {
//         id: 1,
//         name: 'Molindu'
//     },
//     {
//         id: 2,
//         name: 'Yasoda'
//     },
//     {
//         id: 3,
//         name: 'Saman'
//     },
//     {
//         id: 4,
//         name: 'Kumara'
//     }
// ];


export default function Search() {
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setIsLoading(true);
        fetchData(API_ENDPOINT);
    }, []);

    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const json = await response.json();
            setData(json.product);
            console.log(json.product);
            setFullData(json.product);
            setIsLoading(false);


        } catch (error) {
            setError(error);
            console.log(error);
            setIsLoading(false);
        }

        // try { // this works
        //     const response = await fetch(url);
        //     if (response.ok) {
        //         const json = await response.json();
        //         setData(json.product);
        //     } else {
        //         throw new Error(`Failed to fetch data: ${response.status} - ${response.statusText}`);
        //     }
        //     setIsLoading(false);
        // } catch (error) {
        //     setError(error);
        //     setIsLoading(false);
        //     console.log(error);
        // }
    }
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color={"#5500dc"} />
            </View>
        );
    }
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>
                    Error in fetch data ... Pleace check your internet connection!
                </Text>
            </View>
        );
    }
    const handleSearch = (query) => {
        setSearchQuery(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(fullData, (user) => {
            return contains(user, formattedQuery);
        });
        setData(filteredData);
    };

    const contains = ({ name }, query) => {

        if (name && name.toLowerCase().includes(query)) {
            return true;
        }
        return false;
    }
    return (
        <SafeAreaView style={styles.safeAreaView}>
            <TextInput
                placeholder='Search'
                clearButtonMode='always'
                style={styles.search}
                autoCapitalize='none'
                autoCorrect={false}
                value={searchQuery}
                onChangeText={(query) => handleSearch(query)}
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()} // Assuming 'id' is a unique identifier
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.itemContainer}>
                        <Image source={{ uri: item.photo }} style={styles.itemImage} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.itemText}>{item.name}</Text>
                            <Text style={styles.itemText}>{item.price}</Text>
                            <Text style={styles.itemText}>{item.category}</Text>
                            <Text style={styles.itemText}>{item.brand}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 10,
    },
    search: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    itemImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    itemText: {
        fontSize: 16,
    },
});