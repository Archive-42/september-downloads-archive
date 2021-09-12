import { Dispatch } from 'react'
import { action, payload, Action } from 'ts-action'
import { SimpleAgent, AccountStatus, VisitorEvents, AgentEvents } from '@smartsupp/websocket-client'

import { Agent } from 'model/Agent'
import { AgentRating } from 'model/Enums'
import { AppThunkAction } from 'types'

export const AgentActions = {
	setRating: action('agent/SET_RATING', payload<AgentRating>()),
	setAgents: action('agent/SET_AGENT', payload<Agent[]>()),
	updateAgentStatus: action('agent/UPDATE_AGENT_STATUS', payload<VisitorEvents.IAgentStatusUpdated>()),
	updateAgent: action('agent/UPDATE_AGENT', payload<AgentEvents.IAgentUpdated>()),
	setConnectedAgents: action('agent/SET_CONNECTED_AGENTS', payload<Agent[]>()),
	setIsAgentTyping: action('agent/SET_IS_AGENT_TYPING', payload<boolean>()),
	setStatus: action('agent/SET_STATUS', payload<AccountStatus>()),
	addConnectedAgent: action('agent/ADD_AGENT', payload<SimpleAgent>()),
	addConnectedAgentFromTransfer: action('agent/ADD_AGENT_FROM_TRANSFER', payload<VisitorEvents.IChatAgentAssigned>()),
	removeConnectedAgentFromTransfer: action(
		'agent/REMOVE_AGENT_FROM_TRANSFER',
		payload<VisitorEvents.IChatAgentUnassigned>(),
	),
	removeConnectedAgent: action('agent/REMOVE_AGENT_FROM_CONNECTED', payload<string>()),
	deleteAgent: action('agent/DELETE_AGENT', payload<string>()),
	removeAllConnectedAgents: action('agent/REMOVE__ALL_AGENTS'),
}

export const setStatus: AppThunkAction<AgentActions> =
	(chatState: AccountStatus) =>
	async (dispatch: Dispatch<Action>): Promise<void> => {
		dispatch(AgentActions.setStatus(chatState))
	}

export type AgentActions = typeof AgentActions
