import TabGroup from './TabGroup.jsx';
import useGetTabGroups from '../hooks/useGetTabGroups.jsx';

const TabGroupList = ({ tabGroups, isSaved }) => {
  return (
    <ul className="flex flex-col gap-1">
      {Object.entries(tabGroups).map(([key, { title, tabs, isGroup, dateCreated }]) => {
        return (
          <li key={key}>
            <TabGroup
              isSaved={isSaved}
              groupId={key}
              isGroup={isGroup}
              savedTitle={title}
              tabs={tabs ?? []}
              dateCreated={dateCreated}
            />
          </li>
        );
      })}
    </ul>
  );
};

const PrimaryContent = ({}) => {
  const { savedTabGroups, currentTabGroups } = useGetTabGroups();
  console.log({ currentTabGroups, savedTabGroups });

  return (
    <div className="m-2 min-h-10">
      <h2 className="mb-1 font-semibold">Open tabs</h2>
      <TabGroupList tabGroups={currentTabGroups} />
      <h2 className="mt-2 mb-1 font-semibold">Saved tabs</h2>
      <TabGroupList isSaved={true} tabGroups={savedTabGroups} />
    </div>
  );
};

export default PrimaryContent;
