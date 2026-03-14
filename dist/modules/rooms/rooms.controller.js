"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomsController = void 0;
class RoomsController {
    constructor(roomsService) {
        this.roomsService = roomsService;
        this.createRoom = (req, res, next) => {
            try {
                const { hostName, maxPlayers, durationSeconds } = req.body;
                const result = this.roomsService.createRoom(hostName, maxPlayers, durationSeconds);
                return res.status(201).json(result);
            }
            catch (err) {
                next(err);
            }
        };
        this.joinRoom = (req, res, next) => {
            try {
                const { roomId } = req.params;
                const { playerName } = req.body;
                const result = this.roomsService.joinRoom(roomId, playerName);
                return res.status(200).json(result);
            }
            catch (err) {
                next(err);
            }
        };
        this.startGame = (req, res, next) => {
            try {
                const { roomId } = req.params;
                const { playerId } = req.body;
                this.roomsService.startGame(roomId, playerId);
                return res.status(204).send();
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.RoomsController = RoomsController;
//# sourceMappingURL=rooms.controller.js.map