import { Injectable } from "@angular/core";
import { connectFunctionsEmulator, getFunctions, httpsCallableData } from "@angular/fire/functions";

@Injectable({providedIn:'root'})
export class Test {

    checkRoomExists() {
        const functions = getFunctions();
        // connectFunctionsEmulator(functions, 'localhost', 5001);
    

        return httpsCallableData<{roomUid: string}, string>(functions, 'checkRoomExists');
    }
    
}