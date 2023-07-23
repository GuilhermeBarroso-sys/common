import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects
  data: any;

}

interface setActWaitProps {
  minutes: number;
}


abstract class Listener<T extends Event> {
  abstract subject : T["subject"];
  abstract queueGroupName : string;
  abstract onMessage(data: T["data"], msg: Message) : void;
  protected ackWait =  5 * 1000;
  public getAckWait() {
    return this.ackWait
  }
  public setAckWait({minutes} : setActWaitProps) {
    this.ackWait = minutes * 1000;
  }
  constructor(private client : Stan ) {}


  subscriptionOptions() {
  	return this.client.subscriptionOptions()
  		.setDeliverAllAvailable()
  		.setManualAckMode(true)
  		.setAckWait(this.ackWait)
  		.setDurableName(this.queueGroupName);
  }

  listen() {
  	const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());

  	subscription.on("message", (msg: Message) => {
  		console.log(
  			`Message received: ${this.subject} / ${this.queueGroupName}`
  		);

  		const parsedDate = this.parseMessage(msg);
  		this.onMessage(parsedDate, msg);
  	});
  }

  parseMessage(msg: Message) {
  	const data = msg.getData();

  	return typeof data === "string"
  		? JSON.parse(data)
  		: JSON.parse(data.toString("utf-8"));
  }
}


export { Listener };