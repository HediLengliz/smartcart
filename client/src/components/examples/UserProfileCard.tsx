import UserProfileCard from '../UserProfileCard';

export default function UserProfileCardExample() {
  return (
    <div className="w-96">
      <UserProfileCard
        name="John Doe"
        email="john.doe@example.com"
        facebookLinked={false}
        onEdit={() => console.log('Edit profile')}
        onLinkFacebook={() => console.log('Link Facebook')}
        onShare={() => console.log('Share lists')}
      />
    </div>
  );
}
