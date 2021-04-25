import { AppState } from './app.state';
import { PeriodicTableService } from './services/periodic-table.service';
import { RoomsService, Room } from './services/rooms.service';
import { UserService } from './services/users.service';
import { cold } from 'jasmine-marbles';
import { User } from './auth/user.model';
import { TestObservable } from 'jasmine-marbles/src/test-observables';

const userStateOne: User = {
  uid: 'uid',
  email: 'email',
  displayName: 'name',
}

const userStateTwo: User = {
  uid: 'uid',
  email: 'email',
  score: 120,
  bestScore: 1000,
  roomUid: 'roomUid',
  role: 'host',
  displayName: 'name',
}

const userBestScore: User = {
  uid: 'uid',
  email: 'email',
  score: 2500,
  bestScore: 1000,
  roomUid: 'roomUid',
  role: 'host',
  displayName: 'name',
}

const userRoom: Room = {
  key: 'roomUid',
  guestUid: 'guestUid',
  hostUid: 'hostUid',
  startGame: true,
  searchingElement: 'Na',
}

const userRoomTwo: Room = {
  key: 'roomUid',
  hostUid: 'hostUid',
  startGame: false,
  searchingElement: 'C',
}

const userRoomThree: Room = {
  key: 'roomUid',
  guestUid: 'guestUid',
  hostUid: 'hostUid2',
  startGame: false,
  searchingElement: null,
}

const roomsOne = [
  userRoom,
  userRoomTwo,
]

function setup(name = '', userStream: TestObservable = null, roomStream: TestObservable = null) {
  const perodicTableSpy = jasmine.createSpyObj<PeriodicTableService>('PeriodicTableService', ['getPeriodicTable'])
  perodicTableSpy.getPeriodicTable.and.returnValue(null)

  const userServiceSpy = jasmine.createSpyObj<UserService>('UserService', ['onUserStateChanged', 'getUser']);
  const userStateChanged$ = name === 'userStateChanged$' ? userStream : cold('-a-|', { a: userStateTwo })
  userServiceSpy.onUserStateChanged.and.returnValue(userStateChanged$)
  userServiceSpy.getUser.and.returnValue(cold('-a-|', { a: { email: 'user@gmail.com' } as User }))
  userServiceSpy.authUserUid$ = name === 'authUserUid$' ? userStream : cold('-a-b-|', { a: 'userUid', b: null });
  userServiceSpy.user$ = name === 'user$' ? userStream : cold('-a-b-|', { a: userStateOne, b: userStateTwo })

  const roomsServiceSpy = jasmine.createSpyObj<RoomsService>('RoomsService', ['onMyRoomStateChanged']);
  const room = name === 'myRoom$' ? roomStream : cold('-a-b-b-|', { a: userRoom, b: userRoomTwo })
  roomsServiceSpy.onMyRoomStateChanged.and.returnValue(room)
  roomsServiceSpy.rooms$ = name === 'rooms$' ? userStream : cold('-a-', { a: roomsOne })



  const appState = new AppState(userServiceSpy, roomsServiceSpy, perodicTableSpy);


  return { appState, perodicTableSpy };
}

describe('App State', () => {
  it('should table$ be defined and called getPerodicTable', () => {
    const { appState, perodicTableSpy } = setup();
    expect(appState.table$).toBeDefined();
    expect(perodicTableSpy.getPeriodicTable).toHaveBeenCalled();
  })

  it('should stream perodic table', () => {
    const { appState } = setup();
    appState.table$ = cold('-a-|', { a: 'periodioc table' });
    const expected$ = cold('-z-|', { z: 'periodioc table' })
    expect(appState.table$).toBeObservable(expected$)
  });

  it('should isLogin return boolean', () => {
    const authUserUid$ = cold('-a-b-|', { a: 'userUid', b: null })
    const { appState } = setup('authUserUid$', authUserUid$);

    const expected$ = cold('-z-y-|', { z: true, y: false })
    expect(appState.isLogin$).toBeObservable(expected$)
  })

  it('should stream hasRoom$', () => {
    const user$ = cold('-a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('-z-y----|', { z: false, y: true })
    expect(appState.hasRoom$).toBeObservable(expected$);
  })

  it('should stream userRoomUid$', () => {
    const user$ = cold('-a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('---y----|', { y: 'roomUid' })
    expect(appState.userRoomUid$).toBeObservable(expected$);
  })


  it('should stream userUid$', () => {
    const user$ = cold('-a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('-z------|', { z: 'uid' })
    expect(appState.userUid$).toBeObservable(expected$);
  })


  it('should stream role$', () => {
    const user$ = cold('   -a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('---y----|', { y: 'host' })
    expect(appState.role$).toBeObservable(expected$);
  })

  it('should stream score$', () => {
    const user$ = cold('-a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('---y----|', { y: 120 })
    expect(appState.score$).toBeObservable(expected$);
  })

  it('should stream bestScore$', () => {
    const user$ = cold('-a-b-b-b|', { a: userStateOne, b: userStateTwo })
    const { appState } = setup('user$', user$);

    const expected$ = cold('---y----|', { y: 1000 })
    expect(appState.bestScore$).toBeObservable(expected$);
  })

  it('should stream isBestScore$', () => {
    const user$ = cold('-a-b-b-b-c|', { a: userStateOne, b: userStateTwo, c: userBestScore })
    const { appState } = setup('user$', user$);

    const expected$ = cold('---------w|', { w: 2500 })
    expect(appState.isBestScore$).toBeObservable(expected$);
  })

  it('should stream userRoom$', () => {
    const user$ = cold('-a-b-b-b-c|', { a: userStateOne, b: userStateTwo, c: userBestScore });
    const { appState } = setup('user$', user$);

    const expected$ = cold('----w-z-z-|', { z: userRoomTwo, w: userRoom })
    expect(appState.userRoom$).toBeObservable(expected$);
  })

  it('should stream startGame$', () => {
    const myRoom$ = cold('-a-b-b-|', { a: userRoom, b: userRoomTwo });
    const { appState } = setup('myRoom$', null, myRoom$);

    const expected$ = cold('----w-z-z-|', { z: false, w: true })
    expect(appState.startGame$).toBeObservable(expected$);
  })

  it('should stream periodicTableRoom$', () => {
    const myRoom$ = cold('-a-b-b-c-|', { a: userRoom, b: userRoomTwo, c: undefined });
    const { appState } = setup('myRoom$', null, myRoom$);

    const expected$ = cold('----w-z-z---|', { z: { startGame: false, searchingElement: 'C' }, w: { startGame: true, searchingElement: 'Na' } })
    expect(appState.periodicTableRoom$).toBeObservable(expected$);
  })

  it('should stream searchingElementChanged$', () => {
    const myRoom$ = cold('-a-b-b-c-|', { a: userRoom, b: userRoomTwo, c: userRoomThree });
    const { appState } = setup('myRoom$', null, myRoom$);

    const expected$ = cold('----z-w-w-y-|', { z: 'Na', w: 'C', y: null })
    expect(appState.searchingElementChanged$).toBeObservable(expected$);
  })

  describe('playersInRooms$', () => {

    it('should stream emptyRooms$', () => {
      const rooms$ = cold('-a-----|', { a: [] });
      const { appState } = setup('rooms$', rooms$)

      const expected$ = cold('-(zz)--|', { z: [] })
      expect(appState.playersInRooms$).toBeObservable(expected$);
    })


    it('should stream roomPlayers$', () => {
      const rooms$ = cold('   -a--------------|', { a: roomsOne });
      const { appState } = setup('rooms$', rooms$)

      const expected$ = cold('-------z--------|', {
        z: [
          { roomUid: 'roomUid', guest: { email: 'user@gmail.com' }, host: { email: 'user@gmail.com' } },
          { roomUid: 'roomUid', guest: null, host: { email: 'user@gmail.com' } },
        ]
      })
      expect(appState.playersInRooms$).toBeObservable(expected$);
    })

  });

  it('should stream hostPlayer$', () => {
    const myRoom$ = cold('  -a-b-b-c-|', { a: userRoom, b: userRoomTwo, c: userRoomThree });
    const { appState } = setup('myRoom$', null, myRoom$);

    const expected$ = cold('-----z-----z-|', { z: userStateTwo, y: userBestScore })
    expect(appState.hostPlayer$).toBeObservable(expected$);
  })

  it('should stream guestPlayer$', () => {
    const user$ = cold('-a-b-|', { a: userStateOne, b: userStateTwo })
    const myRoom$ = cold('-a-b-c-|', { a: userRoom, b: userRoomTwo, c: userRoomThree });
    const { appState } = setup('myRoom$', null, myRoom$);

    const expected$ = cold('-----z---z-|', { z: userStateTwo })
    expect(appState.guestPlayer$).toBeObservable(expected$);
  })

});