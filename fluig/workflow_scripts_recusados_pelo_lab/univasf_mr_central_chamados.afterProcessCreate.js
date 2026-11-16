function afterProcessCreate(processId) {
    hAPI.setCardValue("numChamado", String(processId));
}
