import { useState } from 'react'
import { toast } from 'sonner'
import { Settings, Plus, Trash2 } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  appSettings,
  customTiles,
  hiddenTiles,
  iconOverrides,
  appAccounts,
  profilesList,
} from '@/hooks/useEntities'

const VISIBILITY_FIELDS = [
  ['can_view_permits', 'Permits'],
  ['can_view_documents', 'Documents'],
  ['can_view_contacts', 'Site contacts'],
  ['can_view_allocation_trakway', 'Allocations (trakway)'],
  ['can_view_allocation_access_veg', 'Allocations (access/veg)'],
  ['can_view_allocation_scaffold', 'Allocations (scaffold)'],
  ['can_view_allocation_site_fitter', 'Allocations (site fitter)'],
  ['can_view_engineer_tools', 'Engineer tools'],
]

function KeyValueTab({ title, description, addLabel, items, isLoading, onAdd, onRemove, creating }) {
  const [keyVal, setKeyVal] = useState('')
  const [valueVal, setValueVal] = useState('')

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Key" value={keyVal} onChange={(e) => setKeyVal(e.target.value)} />
          <Input placeholder="Value" value={valueVal} onChange={(e) => setValueVal(e.target.value)} />
          <Button
            disabled={creating}
            onClick={() => {
              if (!keyVal.trim() || !valueVal.trim()) {
                toast.error('Both key and value are required')
                return
              }
              onAdd(keyVal, valueVal)
              setKeyVal('')
              setValueVal('')
            }}
          >
            <Plus className="mr-1.5 h-4 w-4" />
            {addLabel}
          </Button>
        </div>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !items?.length ? (
          <EmptyState icon={Settings} title="Nothing set yet" />
        ) : (
          <ul className="divide-y divide-border rounded-lg border border-border">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                <span className="font-medium">{item.key}</span>
                <span className="flex-1 truncate text-muted-foreground">{item.value}</span>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onRemove(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default function AdminSettings() {
  const { data: settings, isLoading: settingsLoading } = appSettings.useList()
  const createSetting = appSettings.useCreate()
  const removeSetting = appSettings.useRemove()

  const { data: hidden, isLoading: hiddenLoading } = hiddenTiles.useList()
  const createHidden = hiddenTiles.useCreate()
  const removeHidden = hiddenTiles.useRemove()

  const { data: icons, isLoading: iconsLoading } = iconOverrides.useList()
  const createIcon = iconOverrides.useCreate()
  const removeIcon = iconOverrides.useRemove()

  const { data: tiles, isLoading: tilesLoading } = customTiles.useList()
  const createTile = customTiles.useCreate()
  const removeTile = customTiles.useRemove()

  const { data: profiles } = profilesList.useList()
  const { data: accounts } = appAccounts.useList()
  const upsertAccount = appAccounts.useCreate()
  const updateAccount = appAccounts.useUpdate()

  const accountFor = (profileId) => accounts?.find((a) => a.profile_id === profileId)

  const toggleVisibility = (profile, field, value) => {
    const existing = accountFor(profile.id)
    if (existing) {
      updateAccount.mutate({ id: existing.id, [field]: value })
    } else {
      upsertAccount.mutate({ profile_id: profile.id, [field]: value })
    }
  }

  return (
    <div>
      <PageHeader title="Admin settings" description="Feature visibility, app configuration and home dashboard customization." />

      <Tabs defaultValue="visibility">
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="visibility">Feature visibility</TabsTrigger>
          <TabsTrigger value="settings">App settings</TabsTrigger>
          <TabsTrigger value="tiles">Custom tiles</TabsTrigger>
          <TabsTrigger value="hidden">Hidden tiles</TabsTrigger>
          <TabsTrigger value="icons">Icon overrides</TabsTrigger>
        </TabsList>

        <TabsContent value="visibility">
          <Card>
            <CardContent className="p-0">
              {!profiles?.length ? (
                <div className="p-5">
                  <EmptyState icon={Settings} title="No users yet" />
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {profiles.map((profile) => {
                    const account = accountFor(profile.id)
                    return (
                      <li key={profile.id} className="p-5">
                        <p className="mb-3 text-sm font-semibold">{profile.full_name}</p>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {VISIBILITY_FIELDS.map(([field, label]) => (
                            <div key={field} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                              <Label className="text-sm font-normal">{label}</Label>
                              <Switch
                                checked={account ? Boolean(account[field]) : true}
                                onCheckedChange={(v) => toggleVisibility(profile, field, v)}
                              />
                            </div>
                          ))}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <KeyValueTab
            title="App settings"
            description="Generic key/value application configuration."
            addLabel="Add setting"
            items={settings}
            isLoading={settingsLoading}
            creating={createSetting.isPending}
            onAdd={(key, value) =>
              createSetting.mutate({ key, value }, { onSuccess: () => toast.success('Setting added') })
            }
            onRemove={(id) => removeSetting.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="tiles">
          <Card>
            <CardContent className="space-y-4 p-5">
              <div>
                <p className="text-sm font-medium">Custom tiles</p>
                <p className="text-xs text-muted-foreground">Admin-defined home page tiles.</p>
              </div>
              <TileAdder onAdd={(title) => createTile.mutate({ title }, { onSuccess: () => toast.success('Tile added') })} creating={createTile.isPending} />
              {tilesLoading ? (
                <p className="text-sm text-muted-foreground">Loading…</p>
              ) : !tiles?.length ? (
                <EmptyState icon={Settings} title="No custom tiles yet" />
              ) : (
                <ul className="divide-y divide-border rounded-lg border border-border">
                  {tiles.map((tile) => (
                    <li key={tile.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                      <span>{tile.title}</span>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeTile.mutate(tile.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hidden">
          <KeyValueTab
            title="Hidden tiles"
            description="Home page card keys to hide, with an optional display title."
            addLabel="Hide tile"
            items={hidden?.map((h) => ({ ...h, value: h.title || '—' }))}
            isLoading={hiddenLoading}
            creating={createHidden.isPending}
            onAdd={(key, value) =>
              createHidden.mutate({ key, title: value }, { onSuccess: () => toast.success('Tile hidden') })
            }
            onRemove={(id) => removeHidden.mutate(id)}
          />
        </TabsContent>

        <TabsContent value="icons">
          <KeyValueTab
            title="Icon overrides"
            description="Map a tile/card key to a custom icon image URL."
            addLabel="Add override"
            items={icons?.map((i) => ({ ...i, value: i.image_url }))}
            isLoading={iconsLoading}
            creating={createIcon.isPending}
            onAdd={(key, value) =>
              createIcon.mutate({ key, image_url: value }, { onSuccess: () => toast.success('Override added') })
            }
            onRemove={(id) => removeIcon.mutate(id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TileAdder({ onAdd, creating }) {
  const [title, setTitle] = useState('')
  return (
    <div className="flex gap-2">
      <Input placeholder="Tile title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Button
        disabled={creating}
        onClick={() => {
          if (!title.trim()) {
            toast.error('Title is required')
            return
          }
          onAdd(title)
          setTitle('')
        }}
      >
        <Plus className="mr-1.5 h-4 w-4" />
        Add
      </Button>
    </div>
  )
}
