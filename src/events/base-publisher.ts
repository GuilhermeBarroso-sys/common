import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects
  data: any;

}


abstract class Publisher<T extends Event> {
  abstract subject : T["subject"];
  constructor(protected client : Stan ) {}

  publish(data: T["data"]) : Promise<void>{
  	return new Promise((res,rej) => {
  		this.client.publish(this.subject, JSON.stringify(data), (err) => {
  			if(err) return rej(err);
  			console.log("Event published to subject", this.subject);
  			res();
  		});
  	});
  }
}


export { Publisher };