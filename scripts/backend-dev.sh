#!/bin/bash

# Karbyn Backend Development Helper Script
# Usage: ./scripts/backend-dev.sh [command]

set -e

CANISTER_NAME="karbyn_backend"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

function print_help() {
    echo -e "${BLUE}Karbyn Backend Development Helper${NC}"
    echo ""
    echo "Available commands:"
    echo -e "  ${GREEN}build${NC}       - Build the backend canister"
    echo -e "  ${GREEN}deploy${NC}      - Deploy the backend canister locally"
    echo -e "  ${GREEN}generate${NC}    - Generate Candid interface files"
    echo -e "  ${GREEN}test${NC}        - Run backend tests"
    echo -e "  ${GREEN}clean${NC}       - Clean build artifacts"
    echo -e "  ${GREEN}start${NC}       - Start local IC replica"
    echo -e "  ${GREEN}stop${NC}        - Stop local IC replica"
    echo -e "  ${GREEN}demo${NC}        - Run demo user registration"
    echo -e "  ${GREEN}stats${NC}       - Show current user statistics"
    echo -e "  ${GREEN}help${NC}        - Show this help message"
    echo ""
}

function build() {
    echo -e "${YELLOW}Building backend canister...${NC}"
    cargo build --target wasm32-unknown-unknown --release
    echo -e "${GREEN}✅ Build complete${NC}"
}

function deploy() {
    echo -e "${YELLOW}Deploying backend canister...${NC}"
    dfx deploy $CANISTER_NAME
    echo -e "${GREEN}✅ Deploy complete${NC}"
}

function generate_candid() {
    echo -e "${YELLOW}Generating Candid interface...${NC}"
    
    # Build first
    build
    
    # Generate .did file
    candid-extractor target/wasm32-unknown-unknown/release/${CANISTER_NAME}.wasm > src/${CANISTER_NAME}/${CANISTER_NAME}.did
    
    # Copy to declarations
    cp src/${CANISTER_NAME}/${CANISTER_NAME}.did src/declarations/${CANISTER_NAME}/
    
    echo -e "${GREEN}✅ Candid interface generated${NC}"
}

function test_backend() {
    echo -e "${YELLOW}Running backend tests...${NC}"
    cargo test
    echo -e "${GREEN}✅ Tests complete${NC}"
}

function clean() {
    echo -e "${YELLOW}Cleaning build artifacts...${NC}"
    cargo clean
    rm -rf .dfx/local
    echo -e "${GREEN}✅ Clean complete${NC}"
}

function start_replica() {
    echo -e "${YELLOW}Starting local IC replica...${NC}"
    dfx start --clean --background
    echo -e "${GREEN}✅ Replica started${NC}"
}

function stop_replica() {
    echo -e "${YELLOW}Stopping local IC replica...${NC}"
    dfx stop
    echo -e "${GREEN}✅ Replica stopped${NC}"
}

function run_demo() {
    echo -e "${YELLOW}Running demo user registration...${NC}"
    
    echo -e "${BLUE}Registering Individual user...${NC}"
    dfx canister call $CANISTER_NAME register_user '(record { 
        name = "Alice Johnson"; 
        role = "Individual"; 
        bio = opt "Climate activist from San Francisco"; 
        device_id = opt "alice_device_123" 
    })'
    
    echo -e "${BLUE}Registering Farmer user...${NC}"
    dfx canister call $CANISTER_NAME register_user '(record { 
        name = "Green Valley Farms"; 
        role = "Farmer"; 
        bio = opt "Sustainable agriculture and carbon sequestration"; 
        device_id = opt "farm_device_456" 
    })' --identity farmer || echo "Note: Already registered or different identity needed"
    
    echo -e "${BLUE}Registering NGO user...${NC}"
    dfx canister call $CANISTER_NAME register_user '(record { 
        name = "Earth Restoration Alliance"; 
        role = "NGO"; 
        bio = opt "Large-scale reforestation and carbon offset projects"; 
        device_id = opt "ngo_device_789" 
    })' --identity ngo || echo "Note: Already registered or different identity needed"
    
    echo -e "${GREEN}✅ Demo complete${NC}"
}

function show_stats() {
    echo -e "${YELLOW}Current user statistics:${NC}"
    dfx canister call $CANISTER_NAME get_user_stats
    
    echo -e "${YELLOW}Total users:${NC}"
    dfx canister call $CANISTER_NAME get_all_users | wc -l
}

# Main script logic
case "${1:-help}" in
    "build")
        build
        ;;
    "deploy")
        deploy
        ;;
    "generate")
        generate_candid
        ;;
    "test")
        test_backend
        ;;
    "clean")
        clean
        ;;
    "start")
        start_replica
        ;;
    "stop")
        stop_replica
        ;;
    "demo")
        run_demo
        ;;
    "stats")
        show_stats
        ;;
    "help")
        print_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        print_help
        exit 1
        ;;
esac
