import React from 'react'
import { Text, View } from 'react-native'
import TabBar from "react-native-tab-bar-interaction";

export const TabBarComponent = () => {
      return (
          <TabBar>
            <TabBar.Item
                icon={require('../../assets/icons/basket.png')}
                selectedIcon={require('../../assets/icons/basket.png')}
                title="Tab1"
                screenBackgroundColor={{ backgroundColor: '#008080' }}
            >
              <View>
                  {/*Page Content*/}
              </View>
            </TabBar.Item>
            <TabBar.Item
                icon={require('../../assets/icons/plus.png')}
                selectedIcon={require('../../assets/icons/plus.png')}
                title="Tab2"
                screenBackgroundColor={{ backgroundColor: '#F08080' }}
            >
                <View>
                    {/*Page Content*/}
                </View>
            </TabBar.Item>
            <TabBar.Item
                icon={require('../../assets/icons/profile.png')}
                selectedIcon={require('../../assets/icons/profile.png')}
                title="Tab3"
                screenBackgroundColor={{ backgroundColor: '#485d72' }}
            >
              <View>
                  {/*Page Content*/}
              </View>
            </TabBar.Item>
          </TabBar>
    );
}
