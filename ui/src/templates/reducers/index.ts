import {produce} from 'immer'
import {
  Action,
  SET_STACKS,
  SET_STAGED_TEMPLATE,
  SET_STAGED_TEMPLATE_URL,
  TOGGLE_TEMPLATE_RESOURCE_INSTALL,
} from 'src/templates/actions/creators'
import {CommunityTemplate, RemoteDataState, TemplatesState} from 'src/types'

const defaultCommunityTemplate = (): CommunityTemplate => {
  return {
    sources: [],
    stackID: '',
    summary: {},
    diff: {},
    resourcesToSkip: {},
  }
}

export const defaultState = (): TemplatesState => ({
  stagedCommunityTemplate: defaultCommunityTemplate(),
  stagedTemplateUrl: '',
  status: RemoteDataState.NotStarted,
  byID: {},
  allIDs: [],
  exportTemplate: {
    status: RemoteDataState.NotStarted,
    item: null,
  },
  stacks: [],
})

export const templatesReducer = (
  state: TemplatesState = defaultState(),
  action: Action
): TemplatesState =>
  produce(state, draftState => {
    switch (action.type) {
      case SET_STAGED_TEMPLATE_URL: {
        const {templateUrl} = action

        draftState.stagedTemplateUrl = templateUrl
        return
      }

      case SET_STAGED_TEMPLATE: {
        const {template} = action

        const stagedCommunityTemplate = {
          ...defaultCommunityTemplate(),
          ...template,
        }

        stagedCommunityTemplate.summary.dashboards = (
          template.summary.dashboards || []
        ).map(dashboard => {
          if (!dashboard.hasOwnProperty('shouldInstall')) {
            dashboard.shouldInstall = true
          }
          return dashboard
        })

        stagedCommunityTemplate.summary.telegrafConfigs = (
          template.summary.telegrafConfigs || []
        ).map(telegrafConfig => {
          if (!telegrafConfig.hasOwnProperty('shouldInstall')) {
            telegrafConfig.shouldInstall = true
          }
          return telegrafConfig
        })

        stagedCommunityTemplate.summary.buckets = (
          template.summary.buckets || []
        ).map(bucket => {
          if (!bucket.hasOwnProperty('shouldInstall')) {
            bucket.shouldInstall = true
          }
          return bucket
        })

        stagedCommunityTemplate.summary.checks = (
          template.summary.checks || []
        ).map(check => {
          if (!check.hasOwnProperty('shouldInstall')) {
            check.shouldInstall = true
          }
          return check
        })

        stagedCommunityTemplate.summary.variables = (
          template.summary.variables || []
        ).map(variable => {
          if (!variable.hasOwnProperty('shouldInstall')) {
            variable.shouldInstall = true
          }
          return variable
        })

        stagedCommunityTemplate.summary.notificationRules = (
          template.summary.notificationRules || []
        ).map(notificationRule => {
          if (!notificationRule.hasOwnProperty('shouldInstall')) {
            notificationRule.shouldInstall = true
          }
          return notificationRule
        })

        stagedCommunityTemplate.summary.notificationEndpoints = (
          template.summary.notificationEndpoints || []
        ).map(notificationEndpoint => {
          if (!notificationEndpoint.hasOwnProperty('shouldInstall')) {
            notificationEndpoint.shouldInstall = true
          }
          return notificationEndpoint
        })

        stagedCommunityTemplate.summary.labels = (
          template.summary.labels || []
        ).map(label => {
          if (!label.hasOwnProperty('shouldInstall')) {
            label.shouldInstall = true
          }
          return label
        })

        stagedCommunityTemplate.summary.summaryTask = (
          template.summary.summaryTask || []
        ).map(summaryTask => {
          if (!summaryTask.hasOwnProperty('shouldInstall')) {
            summaryTask.shouldInstall = true
          }
          return summaryTask
        })

        draftState.stagedCommunityTemplate = stagedCommunityTemplate
        return
      }

      case TOGGLE_TEMPLATE_RESOURCE_INSTALL: {
        const {resourceType, shouldInstall, templateMetaName} = action

        const templateToInstall = {...draftState.stagedCommunityTemplate}

        templateToInstall.summary[resourceType].forEach(resource => {
          if (resource.templateMetaName === templateMetaName) {
            resource.shouldInstall = shouldInstall
            if (!shouldInstall) {
              templateToInstall.resourcesToSkip[resource.templateMetaName] =
                resource.kind
            } else if (
              templateToInstall.resourcesToSkip[resource.templateMetaName]
            ) {
              // if we re-check a resource that we un-checked, remove it from the skipped resources hash
              delete templateToInstall.resourcesToSkip[
                resource.templateMetaName
              ]
            }
          }
        })

        draftState.stagedCommunityTemplate = templateToInstall
        return
      }

      case SET_STACKS: {
        const {stacks} = action

        draftState.stacks = stacks
        return
      }
    }
  })

export default templatesReducer
