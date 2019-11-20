import React, { Component } from 'react';
import { Container, Content, Icon, Button, Picker, Item } from 'native-base';

class DropDown extends Component {
  constructor() {
      super();
      this.state = {
          toggleDropdown: true
      }
  }
  onClickButton = () => {
      this.setState({
          toggleDropdown: !this.state.toggleDropdown
      })
  }
  render() {
    return (
        <Container>
            <Content>
                {this.state.toggleDropdown &&  //cek if toggle is true or false
                    this.props.data.map((item, index) => { //loop the first dropdown
                        return (
                            <Content key={index}>
                                <Picker 
                                onValueChange={this.props.add.bind(this)}
                                iosHeader="Agregar"
                                headerBackButtonText="Salir"
                                style={{width:120}}
                                iosIcon={<Icon name="add-circle" style={{ color: "#78b3a3", fontSize: 30 }} />}
                                mode="dropdown" > 
                                    {item.items.map((value, idx) => { //loop the second dropdown
                                        return(
                                            <Item key={idx} label={value} value={idx} />
                                        )
                                    })}
                                </Picker>
                            </Content>
                        )
                    })
                }
            </Content>
        </Container>
    );
  }
}

export default DropDown