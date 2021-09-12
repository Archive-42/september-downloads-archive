import { on } from 'ts-action-immer'
import { reducer } from 'ts-action'
import { AccountStatus } from '@smartsupp/websocket-client'
import { AgentActions } from './actions'
import { AgentRating } from '../../model/Enums'
import { mapAgentFromServerToLocal } from '../../utils/messageHelpers'
import { Agent } from '../../model/Agent'

export const initialState = {
	agents: [] as Agent[],
	connectedAgents: [] as Agent[],
	rating: undefined as AgentRating | undefined,
	isTyping: false,
	status: AccountStatus.Offline,
}

export type AgentState = typeof initialState

export const agentReducer = reducer<AgentState>(
	initialState,
	on(AgentActions.setAgents, (state: AgentState, { payload }) => {
		state.agents = payload
	}),
	on(AgentActions.setConnectedAgents, (state: AgentState, { payload }) => {
		state.connectedAgents = payload
	}),
	on(AgentActions.setRating, (state: AgentState, { payload }) => {
		state.rating = payload
	}),
	on(AgentActions.setIsAgentTyping, (state: AgentState, { payload }) => {
		state.isTyping = payload
	}),
	on(AgentActions.setStatus, (state: AgentState, { payload }) => {
		state.status = payload
	}),
	on(AgentActions.updateAgentStatus, (state: AgentState, { payload }) => {
		state.agents = state.agents.map(p => (p.id === payload.id ? { ...p, status: payload.status } : p))
		state.connectedAgents = state.connectedAgents.map(p => (p.id === payload.id ? { ...p, status: payload.status } : p))
	}),
	on(AgentActions.updateAgent, (state: AgentState, { payload }) => {
		state.agents = state.agents.map(p => (p.id === payload.id ? { ...p, ...payload.changes } : p))
		state.connectedAgents = state.connectedAgents.map(p => (p.id === payload.id ? { ...p, ...payload.changes } : p))
	}),
	on(AgentActions.addConnectedAgent, (state: AgentState, { payload }) => {
		const mappedAgent = mapAgentFromServerToLocal(payload) // TODO refactor
		state.connectedAgents.push(mappedAgent)
	}),
	on(AgentActions.addConnectedAgentFromTransfer, (state: AgentState, { payload }) => {
		const mappedAgent = mapAgentFromServerToLocal(payload.assigned)
		state.connectedAgents.push(mappedAgent)
	}),
	on(AgentActions.removeConnectedAgentFromTransfer, (state: AgentState, { payload }) => {
		const mappedAgent = mapAgentFromServerToLocal(payload.unassigned)
		state.connectedAgents = state.connectedAgents.filter(a => a.id !== mappedAgent.id)
	}),
	on(AgentActions.removeAllConnectedAgents, (state: AgentState, _) => {
		state.connectedAgents = []
	}),
	on(AgentActions.removeConnectedAgent, (state: AgentState, { payload }) => {
		state.connectedAgents = state.connectedAgents.filter(a => a.id !== payload)
	}),
	on(AgentActions.deleteAgent, (state: AgentState, { payload }) => {
		state.agents = state.agents.filter(a => a.id !== payload)
		state.connectedAgents = state.connectedAgents.filter(a => a.id !== payload)
	}),
)
