import { IonRefresher } from "@ionic/react";
import { EventEmitter } from "events";
import React, { Component } from "react";

export default class MyRefresher extends Component {
  
  ionRefresh!: EventEmitter;

  render() {
    return <IonRefresher {...this.props} />
  }
}
